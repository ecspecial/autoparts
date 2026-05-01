import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Modal/Modal';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  article: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  model?: string;
  oem?: string | null;
  lab?: string | null;
}

export default function ProductCard({ 
  id, 
  article, 
  name, 
  price, 
  quantity,
  brand,
  model,
  oem,
  lab,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'error' | 'success' | 'info'>('info');
  
  const [imageSrc, setImageSrc] = useState(`/images/products/${article}.jpg`);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/product-placeholder.png');
    }
  };

  // "В пути" items exist in stock but are not yet arrived — hide price/stock/button
  const isInTransit = lab ? lab.toLowerCase().startsWith('в пути') : false;

  // Format lab badge: split "В пути #21.02.26" into two lines (без # перед датой)
  const formatLabBadge = (labValue: string) => {
    const transitMatch = labValue.match(/^(в пути)\s*(.*)$/i);
    if (transitMatch && transitMatch[2]) {
      const rest = transitMatch[2].trim().replace(/^\s*#\s*/, '');
      return (
        <>
          {transitMatch[1]}
          <br />
          {rest}
        </>
      );
    }
    return labValue;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    const startTime = Date.now();

    try {
      await addToCart({
        article,
        quantity: 1,
        name,
        fullName: name,
        marka: brand || '',
        model: model || '',
        priceSnapshot: price,
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remaining));
      
    } catch (error: any) {
      console.error('Add to cart error:', error);
      
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remaining));
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка добавления в корзину';
      setModalMessage(errorMessage);
      setModalType('error');
      setModalOpen(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
      
      <div className="product-card">
        <Link to={`/product/${id}`} className="product-card-link">
          <div className="product-card-image">
            <img 
              src={imageSrc} 
              alt={name}
              onError={handleImageError}
            />
            {lab && (
              <div className="lab-badge">{formatLabBadge(lab)}</div>
            )}
          </div>
          
          <div className="product-card-content">
            <div className="product-card-header">
              <span className="product-article">Арт: {article}</span>
              {brand && model && (
                <span className="product-brand-model">{brand} {model}</span>
              )}
            </div>
            
            <h3 className="product-card-title">{name}</h3>
            
            {oem && (
              <div className="product-oem">
                <span className="oem-label">OEM:</span> {oem}
              </div>
            )}
            
            {!isInTransit && (
              <div className="product-card-footer">
                <div className="product-price">{price.toLocaleString('ru-RU')} ₽</div>
                <div className="product-stock in-stock">
                  В наличии: {quantity} шт.
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {!isInTransit && (
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="button-spinner"></span>
                Добавление...
              </>
            ) : (
              'В корзину'
            )}
          </button>
        )}
      </div>
    </>
  );
}