import { Link } from 'react-router-dom';
import type { Product } from '../../mockup/productsData';
import './ProductCard.css'; 

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'В наличии';
      case 'on_order': return 'Под заказ';
      case 'out_of_stock': return 'Нет в наличии';
      default: return '';
    }
  };

  const getAvailabilityClass = (status: string) => {
    switch (status) {
      case 'in_stock': return 'in-stock';
      case 'on_order': return 'on-order';
      case 'out_of_stock': return 'out-of-stock';
      default: return '';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    // TODO: Add to cart logic
    console.log('Added to cart:', product.article);
  };

  return (
    <Link to={`/product/${product.article}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>
      
      <div className="product-info">
        <div className="product-article">Артикул {product.article}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-brand">{product.brand} {product.model} ({product.year})</div>
        
        <div className="product-footer">
          <div className="product-price-section">
            <div className="product-price">{product.price.toLocaleString('ru-RU')} ₽</div>
            <div className={`product-availability ${getAvailabilityClass(product.availability)}`}>
              {getAvailabilityText(product.availability)}
            </div>
          </div>
          
          <div className="product-actions">
            <button className="product-cart-btn" onClick={handleAddToCart}>В корзину</button>
            <div className="product-actions-row">
              <a 
                href={`https://www.ozon.ru/search/?text=${encodeURIComponent(product.article)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="marketplace-badge ozon"
                onClick={(e) => e.stopPropagation()}
              >
                ozon
              </a>
              <a 
                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(product.article)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="marketplace-badge wb"
                onClick={(e) => e.stopPropagation()}
              >
                wildberries
              </a>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

