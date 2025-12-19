import { useState } from 'react';
import { currentUser, getOrdersByUserId, getOrderStatusText, getOrderStatusClass } from '../../mockup/usersData';
import type { User } from '../../mockup/usersData';
import './ProfilePage.css';

type ActiveTab = 'profile' | 'orders';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [userData, setUserData] = useState<User>(currentUser);
  const userOrders = getOrdersByUserId(currentUser.id);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    console.log('Saving user data:', userData);
    alert('Изменения сохранены!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-page-title">Личный кабинет</h1>

        <div className="profile-content">
          {/* Sidebar Navigation */}
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

          {/* Main Content */}
          <main className="profile-main">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2 className="profile-section-title">Профиль</h2>

                <form className="profile-form" onSubmit={handleSaveChanges}>
                  <div className="profile-form-grid">
                    {/* Contacts & Balance */}
                    <div className="profile-form-column">
                      <div className="profile-form-group">
                        <label className="profile-form-label">Контакты</label>
                        <input
                          type="text"
                          className="profile-form-input"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          placeholder="Фамилия Имя Отчество"
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Email</label>
                        <input
                          type="email"
                          className="profile-form-input"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          placeholder="user@example.com"
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Телефон</label>
                        <input
                          type="tel"
                          className="profile-form-input"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Оплата</label>
                        <select
                          className="profile-form-select"
                          value={userData.paymentMethod}
                          onChange={(e) => setUserData({ ...userData, paymentMethod: e.target.value as User['paymentMethod'] })}
                        >
                          <option value="card">Банковская карта</option>
                          <option value="cash">Наличные</option>
                          <option value="online">Онлайн оплата</option>
                        </select>
                      </div>
                    </div>

                    {/* Balance & Delivery */}
                    <div className="profile-form-column">
                      <div className="profile-form-group">
                        <label className="profile-form-label">Баланс</label>
                        <div className="profile-balance-display">
                          {userData.balance.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <div className="profile-form-group">
                        <label className="profile-form-label">Доставка</label>
                        <select
                          className="profile-form-select"
                          value={userData.deliveryMethod}
                          onChange={(e) => setUserData({ ...userData, deliveryMethod: e.target.value as User['deliveryMethod'] })}
                        >
                          <option value="courier">Курьером</option>
                          <option value="pickup">Самовывоз</option>
                          <option value="post">Почта России</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="profile-save-btn">
                    Сохранить изменения
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2 className="profile-section-title">Мои заказы</h2>

                {userOrders.length === 0 ? (
                  <div className="orders-empty">
                    <p>У вас пока нет заказов</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {userOrders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-number">№ {order.orderNumber}</div>
                          <div className="order-date">{formatDate(order.date)}</div>
                        </div>

                        <div className="order-body">
                          <div className="order-items">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <div className="order-item-name">
                                  <span>{item.name}</span>
                                  {item.quantity > 1 && (
                                    <span className="order-item-quantity">x{item.quantity}</span>
                                  )}
                                </div>
                                <span className="order-item-article">{item.article}</span>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-price">
                              {order.totalPrice.toLocaleString('ru-RU')} ₽
                            </div>
                            <div className={`order-status ${getOrderStatusClass(order.status)}`}>
                              <span className="status-dot"></span>
                              {getOrderStatusText(order.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

