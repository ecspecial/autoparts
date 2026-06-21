import { useAuth } from '../context/AuthContext';
import { applyUserDiscount } from '../utils/catalogPrice';

export function useCatalogPrice(basePrice: number) {
  const { isAuthenticated, user } = useAuth();
  const base = Number(basePrice) || 0;
  const discountPercent =
    isAuthenticated && user
      ? Math.min(100, Math.max(0, Number(user.discount) || 0))
      : 0;
  const displayPrice = applyUserDiscount(base, discountPercent);

  return {
    basePrice: base,
    displayPrice,
    discountPercent,
    hasDiscount: discountPercent > 0 && displayPrice < base,
  };
}
