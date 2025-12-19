import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getUniqueBrands, getModelsByBrand, findArticlePrefix } from '../../mockup/catalogData';
import { filterProductsByArticlePrefix, getUniqueCategories, productsData } from '../../mockup/productsData';
import type { Product } from '../../mockup/productsData';
import './CatalogPage.css';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModelYear, setSelectedModelYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSort, setSelectedSort] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  
  const brands = getUniqueBrands();
  const modelYears = selectedBrand ? getModelsByBrand(selectedBrand) : [];
  const categories = getUniqueCategories();

  const handleSearch = () => {
    let filteredProducts: Product[] = [];

    // Search by article if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filteredProducts = productsData.filter(product => 
        product.article.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.model.toLowerCase().includes(query)
      );
    }
    // Filter by category only (brand is now optional)
    else if (selectedCategory && !selectedBrand) {
      filteredProducts = productsData.filter(p => p.category === selectedCategory);
    }
    // Use brand/model/year filters
    else if (selectedBrand && selectedModelYear) {
      const [modelCode, yearCode] = selectedModelYear.split('|');
      const articlePrefix = findArticlePrefix(selectedBrand, modelCode, yearCode);
      
      if (articlePrefix) {
        filteredProducts = filterProductsByArticlePrefix(articlePrefix);
      }
      
      // Apply category filter if both brand and category are selected
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }
    }
    
    // Apply sorting
    if (selectedSort === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'name') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setProducts(filteredProducts);
  };

  // Update selected category when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Auto-search when filters change or search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else if (selectedCategory && !selectedBrand) {
      // Category only filter
      handleSearch();
    } else if (selectedBrand && selectedModelYear) {
      handleSearch();
    } else {
      setProducts([]);
    }
  }, [searchQuery, selectedBrand, selectedModelYear, selectedCategory, selectedSort]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedModelYear('');
    setSelectedCategory('');
    setSelectedSort('');
    setProducts([]);
    setSearchParams({});
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        <div className="catalog-header">
          <h1 className="catalog-title">Каталог запчастей</h1>
          <p className="catalog-subtitle">
            Найдите запчасти по артикулу или выберите марку и модель автомобиля
          </p>
        </div>

        {/* Search by Article */}
        <div className="catalog-search-card">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по артикулу или названию (например: SDOCT05-880)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="search-clear-btn" onClick={handleClearSearch}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="catalog-divider">
          <span>или</span>
        </div>

        <div className="catalog-filters-card">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="brand" className="filter-label">Марка автомобиля</label>
              <select
                id="brand"
                className="filter-select"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModelYear('');
                  setProducts([]);
                }}
              >
                <option value="">Выберите марку</option>
                {brands.map(brand => (
                  <option key={brand.code} value={brand.code}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="model" className="filter-label">Модель и год</label>
              <select
                id="model"
                className="filter-select"
                value={selectedModelYear}
                onChange={(e) => setSelectedModelYear(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="">Выберите модель и год</option>
                {modelYears.map((item, index) => (
                  <option key={index} value={`${item.modelCode}|${item.yearCode}`}>
                    {item.model} ({item.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="category" className="filter-label">Категория</label>
              <select
                id="category"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Все категории</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button
              onClick={handleSearch}
              className="search-btn"
              disabled={!selectedBrand || !selectedModelYear}
            >
              Показать запчасти
            </button>
            <button onClick={resetFilters} className="reset-btn">
              Сбросить фильтры
            </button>
          </div>
        </div>

        {products.length > 0 && (
          <>
            <div className="catalog-results-header">
              <div className="results-count">
                Найдено запчастей: <span>{products.length}</span>
              </div>
              <div className="results-sort">
                <label htmlFor="sort">Сортировка:</label>
                <select
                  id="sort"
                  className="sort-select"
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    handleSearch(); // Re-apply search with new sort
                  }}
                >
                  <option value="">По умолчанию</option>
                  <option value="price_asc">Цена: по возрастанию</option>
                  <option value="price_desc">Цена: по убыванию</option>
                  <option value="name">По названию</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {products.length === 0 && (searchQuery.trim() || (selectedBrand && selectedModelYear)) && (
          <div className="no-results">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" stroke="currentColor"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor"/>
            </svg>
            <h3>Запчасти не найдены</h3>
            <p>Попробуйте изменить параметры поиска или выбрать другую модель</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;

