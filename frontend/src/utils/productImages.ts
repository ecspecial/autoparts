const PLACEHOLDER = '/product-placeholder.png';
const MAX_EXTRA_INDEX = 2;

/** URL основного и доп. фото: article.jpg, article_1.jpg, article_2.jpg */
export function getProductImageCandidates(article: string): string[] {
  const base = article.trim();
  if (!base) return [PLACEHOLDER];
  const urls = [`/images/products/${base}.jpg`];
  for (let i = 1; i <= MAX_EXTRA_INDEX; i++) {
    urls.push(`/images/products/${base}_${i}.jpg`);
  }
  return urls;
}

export function probeImageUrl(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Загружает список реально существующих фото; если нет ни одного — placeholder. */
export async function resolveProductImages(article: string): Promise<string[]> {
  const candidates = getProductImageCandidates(article);
  const checks = await Promise.all(
    candidates.map((url) => probeImageUrl(url)),
  );
  const found = candidates.filter((_, i) => checks[i]);
  return found.length > 0 ? found : [PLACEHOLDER];
}
