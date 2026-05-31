import { formatRub } from '../../utils/catalogPrice';
import { useCatalogPrice } from '../../hooks/useCatalogPrice';
import './ProductPrice.css';

interface ProductPriceProps {
  basePrice: number;
  className?: string;
}

export default function ProductPrice({ basePrice, className = '' }: ProductPriceProps) {
  const { displayPrice, basePrice: base, hasDiscount } = useCatalogPrice(basePrice);

  return (
    <div className={`catalog-price ${className}`.trim()}>
      {hasDiscount ? (
        <>
          <span className="catalog-price-old">{formatRub(base)}</span>
          <span className="catalog-price-current">{formatRub(displayPrice)}</span>
        </>
      ) : (
        <span className="catalog-price-current">{formatRub(displayPrice)}</span>
      )}
    </div>
  );
}
