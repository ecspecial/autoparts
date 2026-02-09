import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, itemCount, totalPrice, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Корзина</h1>
          
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 className="cart-empty-title">Корзина пуста</h2>
            <p className="cart-empty-text">Добавьте товары из каталога</p>
            <Link to="/catalog" className="cart-empty-btn">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    // TODO: Navigate to checkout page
    alert('Оформление заказа - функция в разработке');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Корзина</h1>
        
        <div className="cart-content">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Товары ({itemCount})</h2>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img 
                        src={`/images/products/${item.article}.jpg`}
                        alt={item.name}
                        onError={(e) => {
                        e.currentTarget.src = "/product-placeholder.png";
                        }}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link to={`/product/${item.id}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <div className="cart-item-details">
                      <span className="cart-item-brand">{item.marka} {item.model}</span>
                      <span className="cart-item-article">Артикул: {item.article}</span>
                      
                      {/* Availability Status */}
                      {!item.available && (
                        <span className="cart-item-availability out-of-stock">
                          ⚠️ Товар снят с продажи
                        </span>
                      )}
                      {item.available && item.currentStock === 0 && (
                        <span className="cart-item-availability out-of-stock">
                          Нет в наличии
                        </span>
                      )}
                      {item.available && item.currentStock > 0 && item.quantity > item.currentStock && (
                        <span className="cart-item-availability warning">
                          ⚠️ Доступно только {item.currentStock} шт.
                        </span>
                      )}
                      {item.available && item.currentStock > 0 && item.quantity <= item.currentStock && (
                        <span className="cart-item-availability in-stock">
                          В наличии
                        </span>
                      )}
                      
                      {/* Price Changed Warning */}
                      {item.priceChanged && item.currentPrice && (
                        <span className="cart-item-price-change">
                          ⚠️ Цена изменилась: {item.currentPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={!item.available || item.quantity >= item.currentStock}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>

                    <div className="cart-item-price">
                      {(item.priceSnapshot * item.quantity).toLocaleString('ru-RU')} ₽
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Удалить товар"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Итого</h3>
              
              <div className="cart-summary-details">
                <div className="cart-summary-row">
                  <span>Товары ({itemCount})</span>
                  <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="cart-summary-row">
                  <span>Доставка</span>
                  <span className="cart-summary-free">Бесплатно</span>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>К оплате</span>
                <span className="cart-summary-total-price">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Оформить заказ
              </button>

              <Link to="/catalog" className="cart-continue-shopping">
                ← Продолжить покупки
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;