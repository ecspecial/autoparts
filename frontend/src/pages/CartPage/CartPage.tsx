import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api/orders';
import './CartPage.css';

const CartPage = () => {
  const { cart, isLoading, updateQuantity, removeItem, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Sync selection when cart changes (auto-select newly added items)
  useEffect(() => {
    setSelectedIds((prev) => {
      const cartIdSet = new Set(cart.map((i) => i.id));
      const next = new Set<number>();
      // keep existing selections that are still in cart
      prev.forEach((id) => { if (cartIdSet.has(id)) next.add(id); });
      // auto-select any item not previously seen
      cart.forEach((item) => { if (!prev.has(item.id) || next.size === 0) next.add(item.id); });
      return next;
    });
  }, [cart]);

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

  const allSelected = cart.length > 0 && selectedIds.size === cart.length;

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cart.map((i) => i.id)));
    }
  };

  const selectedItems = cart.filter((item) => selectedIds.has(item.id));
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0,
  );
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (selectedIds.size === 0) return;

    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      await ordersApi.createOrder(Array.from(selectedIds));
      await refreshCart();
      navigate('/profile', { state: { tab: 'orders', orderJustPlaced: true } });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Ошибка при оформлении заказа';
      setCheckoutError(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Корзина</h1>

        <div className="cart-content">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <label className="cart-select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <span>Выбрать всё</span>
              </label>
              <h2>Товары ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item ${selectedIds.has(item.id) ? 'cart-item--selected' : ''}`}
                >
                  {/* Checkbox column */}
                  <div className="cart-item-check">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                    />
                  </div>

                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img
                      src={`/images/products/${item.article}.jpg`}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = '/product-placeholder.png';
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
                  <span>Выбрано позиций</span>
                  <span>{selectedIds.size} из {cart.length}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Количество</span>
                  <span>{selectedCount} шт.</span>
                </div>
                <div className="cart-summary-row">
                  <span>Доставка</span>
                  <span className="cart-summary-free">Бесплатно</span>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>К оплате</span>
                <span className="cart-summary-total-price">
                  {selectedTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              {checkoutError && (
                <div className="cart-checkout-error">{checkoutError}</div>
              )}

              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={selectedIds.size === 0 || isCheckingOut}
              >
                {isCheckingOut
                  ? 'Оформление...'
                  : selectedIds.size === 0
                  ? 'Выберите товары'
                  : `Оформить заказ (${selectedIds.size})`}
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