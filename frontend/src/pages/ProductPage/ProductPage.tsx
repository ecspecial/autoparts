import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsData, type Product } from '../../mockup/productsData';
import OzonIcon from '../../components/icons/OzonIcon';
import WildberriesIcon from '../../components/icons/WildberriesIcon';
import './ProductPage.css';

const ProductPage = () => {
  const { article } = useParams<{ article: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (article) {
      const foundProduct = productsData.find(p => p.article === article);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Redirect to 404 if product not found
        navigate('/404', { replace: true });
      }
    }
  }, [article, navigate]);

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="product-loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'В наличии';
      case 'on_order':
        return 'Под заказ';
      case 'out_of_stock':
        return 'Нет в наличии';
      default:
        return availability;
    }
  };

  const getAvailabilityClass = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'in-stock';
      case 'on_order':
        return 'on-order';
      case 'out_of_stock':
        return 'out-of-stock';
      default:
        return '';
    }
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/catalog">Каталог</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.article}</span>
        </nav>

        <div className="product-content">
          {/* Product Image Section */}
          <div className="product-image-section">
            <div className="product-main-image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info-section">
            <div className="product-category-badge">{product.category}</div>
            
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-article">
              <span className="article-label">Артикул:</span>
              <span className="article-value">{product.article}</span>
            </div>

            <div className="product-vehicle-info">
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <span><strong>Марка:</strong> {product.brand}</span>
              </div>
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span><strong>Модель:</strong> {product.model}</span>
              </div>
              <div className="vehicle-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span><strong>Год:</strong> {product.year}</span>
              </div>
            </div>

            <div className="product-price-block">
              <div className="price-info">
                <span className="price-label">Цена</span>
                <span className="price-value">{product.price.toLocaleString('ru-RU')} ₽</span>
              </div>
              
              <div className={`availability-badge ${getAvailabilityClass(product.availability)}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {getAvailabilityText(product.availability)}
              </div>
            </div>

            {/* Marketplace Links */}
            <div className="product-marketplaces">
              <h3 className="marketplaces-title">Также доступно на маркетплейсах:</h3>
              <div className="marketplace-links">
                <a 
                  href={`https://www.ozon.ru/search/?text=${encodeURIComponent(product.article)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="marketplace-link ozon"
                >
                  <span className="marketplace-name">ozon</span>
                  <span className="external-icon">↗</span>
                </a>
                <a 
                  href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(product.article)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="marketplace-link wildberries"
                >
                  <span className="marketplace-name">wildberries</span>
                  <span className="external-icon">↗</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="add-to-cart-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Добавить в корзину
              </button>
              
              <button className="back-to-catalog-btn" onClick={() => navigate('/catalog')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Назад к каталогу
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="product-additional-info">
          <div className="info-card">
            <h3>Описание</h3>
            <p>
              Качественная запчасть {product.name.toLowerCase()} для {product.brand} {product.model} ({product.year} года выпуска). 
              Оригинальное качество, гарантия соответствия. Артикул: {product.article}.
            </p>
          </div>

          <div className="info-card">
            <h3>Совместимость</h3>
            <ul>
              <li><strong>Марка:</strong> {product.brand}</li>
              <li><strong>Модель:</strong> {product.model}</li>
              <li><strong>Год выпуска:</strong> {product.year}+</li>
              <li><strong>Категория:</strong> {product.category}</li>
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
};

export default ProductPage;

