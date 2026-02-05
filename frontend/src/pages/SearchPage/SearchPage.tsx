import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './SearchPage.css';

type SearchType = 'article' | 'oem';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialOem = searchParams.get('oem') || '';
  const [searchType, setSearchType] = useState<SearchType>(initialOem ? 'oem' : 'article');
  const [searchQuery, setSearchQuery] = useState(initialQuery || initialOem);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [articlesFound, setArticlesFound] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const performSearch = async (query: string, type: SearchType) => {
    if (!query.trim()) {
      setSearchResults([]);
      setArticlesFound([]);
      setHasSearched(false);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      if (type === 'oem') {
        // OEM search
        const response = await productsApi.searchByOem(query.trim(), 1, 100);
        setSearchResults(response.products);
        setArticlesFound(response.articlesFound);
        setTotal(response.total);
      } else {
        // Article search
        const response = await productsApi.searchProducts({
          article: query.trim(),
          page: 1,
          limit: 100,
        });
        setSearchResults(response.items);
        setArticlesFound([]);
        setTotal(response.total);
      }
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
    if (initialOem) {
      setSearchType('oem');
      setSearchQuery(initialOem);
      performSearch(initialOem, 'oem');
    } else if (initialQuery) {
      setSearchType('article');
      setSearchQuery(initialQuery);
      performSearch(initialQuery, 'article');
    }
  }, [initialQuery, initialOem]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const paramKey = searchType === 'oem' ? 'oem' : 'query';
    setSearchParams({ [paramKey]: searchQuery });
    performSearch(searchQuery, searchType);
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
          <h1 className="search-title">
            {searchType === 'oem' ? 'Поиск по OEM номеру' : 'Поиск по артикулу'}
          </h1>
          <p className="search-subtitle">
            {searchType === 'oem' 
              ? 'Введите заводской номер производителя (OEM) для поиска аналогов'
              : 'Введите полный или частичный артикул запчасти для быстрого поиска'
            }
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="search-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${searchType === 'article' ? 'active' : ''}`}
            onClick={() => setSearchType('article')}
          >
            По артикулу
          </button>
          <button
            type="button"
            className={`toggle-btn ${searchType === 'oem' ? 'active' : ''}`}
            onClick={() => setSearchType('oem')}
          >
            По OEM
          </button>
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
              placeholder={
                searchType === 'oem'
                  ? 'Например: 6001546685, 1248804070, 8200150625...'
                  : 'Например: SDOCT05-880, KARIO17, BME3405...'
              }
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

        {/* Loading State */}
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Поиск товаров...</p>
          </div>
        )}

        {/* OEM Articles Found Notice */}
        {hasSearched && !loading && searchType === 'oem' && articlesFound.length > 0 && (
          <div className="search-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <div>
              <strong>Найдено аналогов:</strong> {articlesFound.join(', ')}
            </div>
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
                  {searchType === 'oem' && 'Попробуйте удалить дефисы и пробелы из номера.'}
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