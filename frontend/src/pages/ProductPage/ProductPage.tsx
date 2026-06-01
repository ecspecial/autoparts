import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCatalogPrice } from '../../hooks/useCatalogPrice';
import ProductPrice from '../../components/ProductPrice/ProductPrice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../api/products';
import './ProductPage.css';
import Modal from '../../components/Modal/Modal';
import ProductImageGallery from '../../components/ProductImageGallery/ProductImageGallery';


export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const catalogPrice = useCatalogPrice(
    product ? parseFloat(product.price) : 0,
  );
  const [addingToCart, setAddingToCart] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'error' | 'success' | 'info'>('info');
  
  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id, 10));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching product:', productId);
      const data = await productsApi.getProduct(productId);
      console.log('Product loaded:', data);
      setProduct(data);
    } catch (err: any) {
      console.error('Failed to load product:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 404) {
        setError('Товар не найден');
      } else {
        setError('Не удалось загрузить информацию о товаре');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const startTime = Date.now();
    
    try {
      await addToCart({
        article: product.article,
        quantity: 1,
        name: product.name,
        fullName: product.fullName,
        marka: product.marka,
        model: product.model,
        priceSnapshot: catalogPrice.basePrice,
      });
      
      // Ensure spinner shows for at least 500ms
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remaining));
      
      // Success - no modal or alert, just hide spinner
    } catch (error: any) {
      console.error('Add to cart error:', error);
      
      // Ensure spinner shows for at least 500ms even on error
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remaining));
      
      // Show error modal instead of alert
      const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка добавления в корзину';
      setModalMessage(errorMessage);
      setModalType('error');
      setModalOpen(true);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-loading">
          <p>Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="product-loading">
            <h2>{error || 'Товар не найден'}</h2>
            <Link to="/catalog" className="back-to-catalog-btn">
              ← Назад к каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const basePrice = parseFloat(product.price);
  const inStock = product.quantity > 0;

  return (
    <div className="product-page">
         <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            message={modalMessage}
            type={modalType}
        />
      <div className="product-container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/catalog">Каталог</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {product.marka} {product.model}
          </span>
        </div>

        {/* Product Content */}
        <div className="product-content">
          {/* Product Image */}
          <div className="product-image-section">
            <ProductImageGallery
              article={product.article}
              alt={product.fullName}
            />
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            {/* Category Badge */}
            <div className="product-category-badge">{product.brand}</div>

            {/* Product Name */}
            <h1 className="product-name">{product.fullName}</h1>

            {/* Article */}
            <div className="product-article">
              <span className="article-label">АРТИКУЛ:</span>
              <span className="article-value">{product.article}</span>
            </div>

            {/* Vehicle Info */}
            <div className="product-vehicle-info">
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <span><strong>Марка:</strong> {product.marka}</span>
              </div>
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span><strong>Модель:</strong> {product.model}</span>
              </div>
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span><strong>Год:</strong> {product.generation}</span>
              </div>
              {product.oem && (
                <div className="vehicle-info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <span><strong>OEM номер:</strong> {product.oem}</span>
                </div>
              )}
            </div>

            {/* Price Block */}
            <div className="product-price-block">
            <div className="price-info">
                <div className="price-label">Цена</div>
                <ProductPrice basePrice={basePrice} className="catalog-price--page" />
            </div>
            <div className={`availability-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                {inStock ? (
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
                </svg>
                <span>{inStock ? `В наличии: ${product.quantity} шт.` : 'Нет в наличии'}</span>  {/* ← FIXED */}
            </div>
            </div>

            {/* Marketplaces */}
            {(product.ozonUrl || product.wildberriesUrl) && (
              <div className="product-marketplaces">
                <div className="marketplaces-title">Также доступно на маркетплейсах:</div>
                <div className="marketplace-links">
                  {product.ozonUrl && (
                    <a
                      href={product.ozonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="marketplace-link ozon"
                    >
                      <span className="marketplace-name">ozon</span>
                      <span className="external-icon">↗</span>
                    </a>
                  )}
                  {product.wildberriesUrl && (
                    <a
                      href={product.wildberriesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="marketplace-link wildberries"
                    >
                      <span className="marketplace-name">wildberries</span>
                      <span className="external-icon">↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
            {inStock && (
                <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                >
                    {addingToCart ? (
                    <>
                        <div className="button-spinner"></div>
                        Добавление...
                    </>
                    ) : (
                    <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Добавить в корзину
                    </>
                    )}
                </button>
                )}
              <Link to="/catalog" className="back-to-catalog-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Назад к каталогу
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="product-additional-info">
          <div className="info-card">
            <h3>Описание</h3>
            <p>
              {product.name} для {product.marka} {product.model} (
              {product.generation}). Артикул: {product.article}.
            </p>
          </div>

          <div className="info-card">
            <h3>Совместимость</h3>
            <ul>
              <li><strong>Марка:</strong> {product.marka}</li>
              <li><strong>Модель:</strong> {product.model}</li>
              <li><strong>Год выпуска:</strong> {product.generation}</li>
              <li><strong>Категория:</strong> {product.brand}</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Условия</h3>
            <ul>
              <li>✓ Гарантия качества</li>
              <li>✓ Возможность возврата в течение 14 дней</li>
              <li>✓ Доставка по всей России</li>
              <li>✓ Помощь в подборе аналогов</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}