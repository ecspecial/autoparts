import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../api/products';
import './NewArrivalsCarousel.css';

function formatCarouselDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day} / ${month}`;
}

function displayCode(p: Product) {
  const k = p.artKod?.trim();
  return k || p.article;
}

export default function NewArrivalsCarousel() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    productsApi
      .getNewArrivals(15)
      .then((res) => {
        if (!cancelled) setItems(res.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.new-arrivals__slide');
    const step = card ? card.offsetWidth + 12 : Math.min(el.clientWidth * 0.85, 280);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="new-arrivals" aria-labelledby="new-arrivals-heading">
      <div className="new-arrivals__inner">
        <h2 id="new-arrivals-heading" className="new-arrivals__title">
          Новинки
        </h2>
        <p className="new-arrivals__subtitle">
          Свежие позиции по метке в прайсе или последние поступления
        </p>

        {loading ? (
          <div className="new-arrivals__loading">Загрузка…</div>
        ) : (
          <div className="new-arrivals__frame">
            <button
              type="button"
              className="new-arrivals__nav new-arrivals__nav--prev"
              aria-label="Предыдущие товары"
              onClick={() => scrollByDir(-1)}
            >
              ‹
            </button>
            <div className="new-arrivals__track-wrap">
              <div
                ref={trackRef}
                className="new-arrivals__track"
                tabIndex={0}
                role="region"
                aria-label="Карусель новинок"
              >
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="new-arrivals__slide"
                  >
                    <div className="new-arrivals__date">
                      {formatCarouselDate(p.createdAt)}
                    </div>
                    <div className="new-arrivals__img-wrap">
                      <img
                        src={`/images/products/${p.article}.jpg`}
                        alt=""
                        className="new-arrivals__img"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.src.endsWith('/product-placeholder.png')) {
                            img.src = '/product-placeholder.png';
                          }
                        }}
                      />
                    </div>
                    <div className="new-arrivals__code">{displayCode(p)}</div>
                    <div className="new-arrivals__desc">
                      {[p.marka, p.model].filter(Boolean).join(' ')}
                      {p.name ? (
                        <>
                          <br />
                          {p.name}
                        </>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="new-arrivals__nav new-arrivals__nav--next"
              aria-label="Следующие товары"
              onClick={() => scrollByDir(1)}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
