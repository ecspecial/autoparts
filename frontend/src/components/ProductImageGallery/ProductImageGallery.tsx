import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveProductImages } from '../../utils/productImages';
import './ProductImageGallery.css';

interface ProductImageGalleryProps {
  article: string;
  alt: string;
}

const SWIPE_THRESHOLD_PX = 48;

export default function ProductImageGallery({ article, alt }: ProductImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setIndex(0);
    resolveProductImages(article).then((urls) => {
      if (!cancelled) {
        setImages(urls);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [article]);

  const count = images.length;
  const hasMultiple = count > 1;
  const currentSrc = images[index] ?? '/product-placeholder.png';

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count, hasMultiple]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    setIndex((i) => (i + 1) % count);
  }, [count, hasMultiple]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || !hasMultiple) return;
    const endX = e.changedTouches[0]?.clientX ?? start;
    const delta = endX - start;
    if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) goNext();
  };

  return (
    <div
      className="product-gallery"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="product-gallery__viewport">
        {loading ? (
          <div className="product-gallery__loading">Загрузка фото…</div>
        ) : (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            className="product-gallery__img"
            draggable={false}
          />
        )}

        {hasMultiple && !loading && (
          <>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={goPrev}
              aria-label="Предыдущее фото"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--next"
              onClick={goNext}
              aria-label="Следующее фото"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="product-gallery__counter">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMultiple && !loading && (
        <div className="product-gallery__dots" role="tablist" aria-label="Фото товара">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Фото ${i + 1}`}
              className={`product-gallery__dot ${i === index ? 'product-gallery__dot--active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
