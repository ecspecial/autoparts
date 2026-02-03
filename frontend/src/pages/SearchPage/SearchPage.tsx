import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      // Search by article
      const response = await productsApi.searchProducts({
        article: query.trim(),
        page: 1,
        limit: 100, // Show more results on search page
      });

      setSearchResults(response.items);
      setTotal(response.total);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setTotal(0);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ query: searchQuery });
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setTotal(0);
    setSearchParams({});
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1 className="search-title">Поиск по артикулу</h1>
          <p className="search-subtitle">
            Введите полный или частичный артикул запчасти для быстрого поиска
          </p>
        </div>

        <form className="search-form-card" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input-field"
              placeholder="Например: SDOCT05-880, KARIO17, BME3405..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Очистить"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn" disabled={loading}>
            {loading ? 'Поиск...' : 'Найти'}
          </button>
        </form>

        {/* Search Examples */}
        {!hasSearched && !loading && (
          <div className="search-examples">
            <p className="search-examples-title">Примеры поиска:</p>
            <div className="search-examples-tags">
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('SDOCT05');
                  performSearch('SDOCT05');
                  setSearchParams({ query: 'SDOCT05' });
                }}
              >
                SDOCT05
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('KARIO17-520');
                  performSearch('KARIO17-520');
                  setSearchParams({ query: 'KARIO17-520' });
                }}
              >
                KARIO17-520
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('BME3405');
                  performSearch('BME3405');
                  setSearchParams({ query: 'BME3405' });
                }}
              >
                BME3405
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('880');
                  performSearch('880');
                  setSearchParams({ query: '880' });
                }}
              >
                880
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Поиск товаров...</p>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              <>
                <div className="search-results-header">
                  <h2 className="search-results-title">
                    Найдено: <span>{total}</span> {total === 1 ? 'товар' : total < 5 ? 'товара' : 'товаров'}
                  </h2>
                  <p className="search-results-query">по запросу "{searchQuery}"</p>
                </div>

                <div className="search-results-grid">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      article={product.article}
                      name={product.fullName}
                      price={parseFloat(product.price)}
                      quantity={product.quantity}
                      brand={product.marka}
                      model={product.model}
                      oem={product.oem}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="search-no-results">
                <div className="search-no-results-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="11" y1="16" x2="11.01" y2="16"/>
                  </svg>
                </div>
                <h3 className="search-no-results-title">Ничего не найдено</h3>
                <p className="search-no-results-text">
                  По запросу <strong>"{searchQuery}"</strong> товары не найдены.
                  <br />
                  Попробуйте изменить запрос или используйте каталог.
                </p>
                <button className="search-no-results-btn" onClick={handleClear}>
                  Очистить поиск
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;