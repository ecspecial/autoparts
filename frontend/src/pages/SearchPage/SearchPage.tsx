import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [articlesFound, setArticlesFound] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setArticlesFound([]);
      setHasSearched(false);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const response = await productsApi.unifiedSearch(query.trim(), 1, 100);
      setSearchResults(response.products);
      setArticlesFound(response.articlesFound);
      setTotal(response.total);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setArticlesFound([]);
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
    setSearchParams({ q: searchQuery });
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setArticlesFound([]);
    setHasSearched(false);
    setTotal(0);
    setSearchParams({});
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1 className="search-title">Поиск запчастей</h1>
          <p className="search-subtitle">
            Введите артикул или OEM номер производителя для поиска
          </p>
        </div>

        {/* No toggle needed! */}

        <form className="search-form-card" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input-field"
              placeholder="Артикул или OEM номер"
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

        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Поиск товаров...</p>
          </div>
        )}

        {/* Show OEM cross-reference notice only when OEM matches found */}
        {hasSearched && !loading && articlesFound.length > 0 && (
          <div className="search-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
              <strong>Найдено аналогов по OEM:</strong> {articlesFound.join(', ')}
            </div>
          </div>
        )}

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
                      name={product.name}
                      price={parseFloat(product.price)}
                      quantity={product.quantity}
                      brand={product.marka}
                      model={product.model}
                      oem={product.oem}
                      lab={product.lab}
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