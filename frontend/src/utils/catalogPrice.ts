/** Цена каталога со скидкой клиента (как на бэкенде при заказе из API). */
export function applyUserDiscount(
  basePrice: number,
  discountPercent: number,
): number {
  const base = Number(basePrice) || 0;
  const dis = Math.min(100, Math.max(0, Number(discountPercent) || 0));
  if (dis <= 0) return base;
  return Math.round(base * (100 - dis) / 100);
}

export function formatRub(price: number): string {
  return `${price.toLocaleString('ru-RU')} ₽`;
}
