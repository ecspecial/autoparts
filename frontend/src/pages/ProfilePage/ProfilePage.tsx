import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { deliveryApi } from '../../api/delivery';
import { ordersApi } from '../../api/orders';
import type { DeliveryMethod } from '../../api/delivery';
import type { UserProfile } from '../../api/auth';
import type { Order } from '../../api/orders';
import './ProfilePage.css';

type ActiveTab = 'profile' | 'orders';

const DEFAULT_DELIVERY_CODE = 'С-О-Н';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const ProfilePage = () => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    (location.state as any)?.tab === 'orders' ? 'orders' : 'profile',
  );

  // Profile tab state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Orders tab state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated && orders.length === 0 && !ordersLoading) {
      loadOrders();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, methods] = await Promise.all([
        authApi.getProfile(),
        deliveryApi.getMethods(),
      ]);
      setProfile(profileData);
      setDeliveryMethods(methods);
      setDeliveryAddress(profileData.deliveryAddress || '');

      if (profileData.preferredDelivery) {
        const exists = methods.some((m) => m.code1c === profileData.preferredDelivery);
        setSelectedDelivery(exists ? profileData.preferredDelivery : DEFAULT_DELIVERY_CODE);
      } else {
        setSelectedDelivery(DEFAULT_DELIVERY_CODE);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      const deliveryMethod = deliveryMethods.find((m) => m.code1c === selectedDelivery);
      await authApi.updateDelivery(selectedDelivery, deliveryMethod?.name || '');
      if (deliveryMethod && !deliveryMethod.name.includes('САМОВЫВОЗ')) {
        await authApi.updateDeliveryAddress(deliveryAddress || null);
      } else {
        await authApi.updateDeliveryAddress(null);
      }
      await refreshProfile();
      setSaveMessage('Данные доставки сохранены');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save delivery:', error);
      setSaveMessage('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1 className="profile-page-title">Личный кабинет</h1>
          <p>Пожалуйста, войдите в систему.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1 className="profile-page-title">Личный кабинет</h1>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-page-title">Личный кабинет</h1>

        <div className="profile-content">
          <aside className="profile-sidebar">
            <nav className="profile-nav">
              <button
                className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Профиль
              </button>
              <button
                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('orders');
                  loadOrders();
                }}
              >
                Мои заказы
                {orders.length > 0 && (
                  <span className="orders-nav-badge">{orders.length}</span>
                )}
              </button>
            </nav>
          </aside>

          <main className="profile-main">
            {/* ── Profile Tab ─────────────────────────────────────── */}
            {activeTab === 'profile' && profile && (
              <div className="profile-section">
                <h2 className="profile-section-title">Профиль</h2>

                {!profile.isActive && (
                  <div className="profile-activation-notice">
                    <strong>Ваш аккаунт ожидает активации.</strong>
                    <p>После проверки данных менеджер присвоит вам клиентский номер и вы сможете оформлять заказы.</p>
                  </div>
                )}

                <form className="profile-form" onSubmit={handleSaveDelivery}>
                  <div className="profile-form-grid">
                    <div className="profile-form-column">
                      <div className="profile-form-group">
                        <label className="profile-form-label">
                          {profile.entityType === 'individual' ? 'ФИО' : 'Организация'}
                        </label>
                        <div className="profile-form-value">{profile.fullName}</div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Логин</label>
                        <div className="profile-form-value">{profile.login}</div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Email</label>
                        <div className="profile-form-value">{profile.email}</div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Телефон</label>
                        <div className="profile-form-value">{profile.phone}</div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Тип</label>
                        <div className="profile-form-value">
                          {profile.entityType === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}
                        </div>
                      </div>
                    </div>

                    <div className="profile-form-column">
                      <div className="profile-form-group">
                        <label className="profile-form-label">Баланс</label>
                        <div className="profile-balance-display">
                          {profile.balance.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Статус</label>
                        <div className={`profile-status-badge ${profile.isActive ? 'active' : 'pending'}`}>
                          {profile.isActive ? 'Активен' : 'Ожидает активации'}
                        </div>
                      </div>
                      {profile.clientNumber1c && (
                        <div className="profile-form-group">
                          <label className="profile-form-label">Клиентский номер</label>
                          <div className="profile-form-value">{profile.clientNumber1c}</div>
                        </div>
                      )}
                      <div className="profile-form-group">
                        <label className="profile-form-label">Скидка</label>
                        <div className="profile-form-value">{profile.discount}%</div>
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Доставка</label>
                        <select
                          className="profile-form-select"
                          value={selectedDelivery}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            const method = deliveryMethods.find((m) => m.code1c === newCode);
                            setSelectedDelivery(newCode);
                            if (method && method.name.includes('САМОВЫВОЗ')) {
                              setDeliveryAddress('');
                            }
                          }}
                        >
                          <option value="">Не выбрано</option>
                          {deliveryMethods.map((m) => (
                            <option key={m.id} value={m.code1c}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      {selectedDelivery &&
                        !deliveryMethods.find((m) => m.code1c === selectedDelivery)?.name.includes('САМОВЫВОЗ') && (
                          <div className="profile-form-group">
                            <label className="profile-form-label">Адрес доставки</label>
                            <textarea
                              className="profile-form-textarea"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Введите адрес доставки"
                              rows={3}
                            />
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="profile-save-row">
                    <button type="submit" className="profile-save-btn" disabled={saving}>
                      {saving ? 'Сохранение...' : 'Сохранить доставку'}
                    </button>
                    {saveMessage && (
                      <span className={`profile-save-message ${saveMessage.includes('Ошибка') ? 'error' : ''}`}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* ── Orders Tab ──────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2 className="profile-section-title">Мои заказы</h2>

                {!profile?.isActive ? (
                  <div className="orders-empty">
                    <p>Оформление заказов будет доступно после активации аккаунта менеджером.</p>
                  </div>
                ) : ordersLoading ? (
                  <div className="orders-empty"><p>Загрузка заказов...</p></div>
                ) : orders.length === 0 ? (
                  <div className="orders-empty"><p>У вас пока нет заказов</p></div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderIds.has(order.id);
                      const orderTotal = order.items.reduce(
                        (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,
                        0,
                      );
                      return (
                        <div key={order.id} className="order-card">
                          {/* Collapsed header row */}
                          <button
                            className="order-header"
                            onClick={() => toggleOrder(order.id)}
                          >
                            <div className="order-header-left">
                              <span className="order-reference">{order.reference}</span>
                              <span className="order-date">{formatDate(order.createdAt)}</span>
                              <span className="order-items-count">
                                {order.items.length} поз.
                              </span>
                            </div>
                            <div className="order-header-right">
                              <span className="order-total">
                                {orderTotal.toLocaleString('ru-RU')} ₽
                              </span>
                              {order.status ? (
                                <span className="order-status-badge">{order.status}</span>
                              ) : (
                                <span className="order-status-badge order-status-badge--new">
                                  Новый
                                </span>
                              )}
                              <span className={`order-chevron ${isExpanded ? 'order-chevron--open' : ''}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="6 9 12 15 18 9"/>
                                </svg>
                              </span>
                            </div>
                          </button>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="order-details">
                              <div className="order-table">
                                <div className="order-table-head">
                                  <span>Наименование</span>
                                  <span>Артикул</span>
                                  <span className="text-right">Кол-во</span>
                                  <span className="text-right">Цена</span>
                                  <span className="text-right">Скидка</span>
                                  <span className="text-right">Итог</span>
                                  <span className="text-center">Статус</span>
                                </div>
                                {order.items.map((item) => (
                                  <div key={item.id} className="order-table-row">
                                    <span className="order-item-name">{item.name}</span>
                                    <span className="order-item-article">{item.article}</span>
                                    <span className="text-right">{item.quantity} шт.</span>
                                    <span className="text-right">
                                      {Number(item.priceSnapshot).toLocaleString('ru-RU')} ₽
                                    </span>
                                    <span className="text-right order-item-empty">
                                      {item.discount != null ? `${item.discount}%` : '—'}
                                    </span>
                                    <span className="text-right">
                                      {item.priceAfterDiscount != null
                                        ? `${Number(item.priceAfterDiscount).toLocaleString('ru-RU')} ₽`
                                        : '—'}
                                    </span>
                                    <span className="text-center">
                                      {item.status ? (
                                        <span className="order-item-status">{item.status}</span>
                                      ) : (
                                        <span className="order-item-status order-item-status--new">
                                          Новый
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;