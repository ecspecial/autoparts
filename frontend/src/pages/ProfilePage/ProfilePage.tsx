import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { deliveryApi } from '../../api/delivery';
import type { DeliveryMethod } from '../../api/delivery';
import type { UserProfile } from '../../api/auth';
import './ProfilePage.css';

type ActiveTab = 'profile' | 'orders';

const DEFAULT_DELIVERY_CODE = 'С-О-Н'; // САМОВЫВОЗ НАЛ

const ProfilePage = () => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, methods] = await Promise.all([
        authApi.getProfile(),
        deliveryApi.getMethods(),
      ]);
      setProfile(profileData);
      setDeliveryMethods(methods);

      // Use user's preferred delivery, or default to САМОВЫВОЗ НАЛ
      if (profileData.preferredDelivery) {
        // Validate that saved delivery still exists in current methods
        const exists = methods.some(m => m.code1c === profileData.preferredDelivery);
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

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    // Validate delivery code exists in loaded methods
    const valid = deliveryMethods.some(m => m.code1c === selectedDelivery);
    if (!valid) {
      setSaveMessage('Выбранный способ доставки недоступен');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage('');
    try {
      await authApi.updateDelivery(selectedDelivery);
      await refreshProfile();
      setSaveMessage('Способ доставки сохранен');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save delivery:', error);
      setSaveMessage('Ошибка сохранения');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
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
                onClick={() => setActiveTab('orders')}
              >
                Мои заказы
              </button>
            </nav>
          </aside>

          <main className="profile-main">
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
                          onChange={(e) => setSelectedDelivery(e.target.value)}
                        >
                          {deliveryMethods.length === 0 ? (
                            <option value="">Загрузка...</option>
                          ) : (
                            deliveryMethods.map((m) => (
                              <option key={m.id} value={m.code1c}>
                                {m.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="profile-save-row">
                    <button type="submit" className="profile-save-btn" disabled={saving}>
                      {saving ? 'Сохранение...' : 'Сохранить доставку'}
                    </button>
                    {saveMessage && (
                      <span className={`profile-save-message ${saveMessage.includes('Ошибка') || saveMessage.includes('недоступен') ? 'error' : ''}`}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2 className="profile-section-title">Мои заказы</h2>
                {!profile?.isActive ? (
                  <div className="orders-empty">
                    <p>Оформление заказов будет доступно после активации аккаунта менеджером.</p>
                  </div>
                ) : (
                  <div className="orders-empty">
                    <p>У вас пока нет заказов</p>
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