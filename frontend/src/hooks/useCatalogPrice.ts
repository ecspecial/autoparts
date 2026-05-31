import { useAuth } from '../context/AuthContext';
import { applyUserDiscount } from '../utils/catalogPrice';

export function useCatalogPrice(basePrice: number) {
  const { isAuthenticated, user } = useAuth();
  const base = Number(basePrice) || 0;
  const discountPercent =
    isAuthenticated && user && user.discount > 0 ? user.discount : 0;
  const displayPrice = applyUserDiscount(base, discountPercent);

  return {
    basePrice: base,
    displayPrice,
    discountPercent,
    hasDiscount: discountPercent > 0 && displayPrice < base,
  };
}
