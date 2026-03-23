import type { OrderItem } from '../api/orders';

/**
 * Цена за единицу: от базовой priceSnapshot, с учётом скидки и итога после скидки.
 * Если скидка и итог оба 0 при ненулевой базовой цене — считаем, что менеджер ещё не выставил скидку (используем базу).
 */
export function getOrderItemUnitPrice(item: OrderItem): number {
  const snap = Number(item.priceSnapshot);
  const pad =
    item.priceAfterDiscount != null ? Number(item.priceAfterDiscount) : null;
  const disc = item.discount != null ? Number(item.discount) : null;

  if (snap === 0) return 0;

  const noDiscountApplied =
    (pad === null || pad === 0) && (disc === null || disc === 0);
  if (noDiscountApplied) {
    return snap;
  }

  if (pad != null && pad !== 0) {
    return pad;
  }

  if (disc != null && disc > 0) {
    return snap * (1 - disc / 100);
  }

  return snap;
}
