import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsData } from '../../mockup/productsData';
import type { Product } from '../../mockup/productsData';
import ProductCard from '../../components/ProductCard/ProductCard';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // Search by article (partial match, case-insensitive)
    const searchTerm = query.trim().toLowerCase();
    const results = productsData.filter(product => 
      product.article.toLowerCase().includes(searchTerm)
    );

    setSearchResults(results);
    setHasSearched(true);
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
          <button type="submit" className="search-submit-btn">
            Найти
          </button>
        </form>

        {/* Search Examples */}
        {!hasSearched && (
          <div className="search-examples">
            <p className="search-examples-title">Примеры поиска:</p>
            <div className="search-examples-tags">
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('SDOCT05');
                  const e = { preventDefault: () => {} } as React.FormEvent;
                  handleSearch(e);
                }}
              >
                SDOCT05
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('KARIO17-520');
                  const e = { preventDefault: () => {} } as React.FormEvent;
                  handleSearch(e);
                }}
              >
                KARIO17-520
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('BME3405');
                  const e = { preventDefault: () => {} } as React.FormEvent;
                  handleSearch(e);
                }}
              >
                BME3405
              </button>
              <button
                type="button"
                className="search-example-tag"
                onClick={() => {
                  setSearchQuery('880');
                  const e = { preventDefault: () => {} } as React.FormEvent;
                  handleSearch(e);
                }}
              >
                880
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              <>
                <div className="search-results-header">
                  <h2 className="search-results-title">
                    Найдено: <span>{searchResults.length}</span> {searchResults.length === 1 ? 'товар' : searchResults.length < 5 ? 'товара' : 'товаров'}
                  </h2>
                  <p className="search-results-query">по запросу "{searchQuery}"</p>
                </div>

                <div className="search-results-grid">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
                  По запросу "<strong>{searchQuery}</strong>" товары не найдены.
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

