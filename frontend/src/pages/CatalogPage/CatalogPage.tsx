import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product, CategoriesResponse } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './CatalogPage.css';

export default function CatalogPage() {
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedMarka, setSelectedMarka] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [selectedPartType, setSelectedPartType] = useState<string>('');
  
  // Dynamic part types based on current filters
  const [availablePartTypes, setAvailablePartTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [searchParams] = useSearchParams();
  const nameKeyword = searchParams.get('nameKeyword') || '';
  const navigate = useNavigate();

  // Синхронизация фильтров с URL (?marka=&model=&generation=&type=) — с главной страницы
  useEffect(() => {
    const m = searchParams.get('marka') || '';
    const mo = searchParams.get('model') || '';
    const g = searchParams.get('generation') || '';
    const t = searchParams.get('type') || '';
    if (m || mo || g || t) {
      setSelectedMarka(m);
      setSelectedModel(mo);
      setSelectedGeneration(g);
      setSelectedPartType(t);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load available part types when marka/model/generation change
  useEffect(() => {
    loadAvailableTypes();
  }, [selectedMarka, selectedModel, selectedGeneration]);

  // Load products when filters or page change
  useEffect(() => {
    loadProducts();
  }, [selectedMarka, selectedModel, selectedGeneration, selectedPartType, currentPage, nameKeyword]);

  const loadCategories = async () => {
    try {
      const data = await productsApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Не удалось загрузить категории');
    }
  };

  const loadAvailableTypes = async () => {
    setLoadingTypes(true);
    try {
      const types = await productsApi.getAvailableTypes({
        marka: selectedMarka || undefined,
        model: selectedModel || undefined,
        generation: selectedGeneration || undefined,
      });
      setAvailablePartTypes(types);
      // If currently selected type is no longer available, reset it
      if (selectedPartType && !types.includes(selectedPartType)) {
        setSelectedPartType('');
      }
    } catch (err) {
      console.error('Failed to load available types:', err);
    } finally {
      setLoadingTypes(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsApi.searchProducts({
        marka: selectedMarka || undefined,
        model: selectedModel || undefined,
        generation: selectedGeneration || undefined,
        type: selectedPartType || undefined,
        nameKeyword: nameKeyword || undefined, 
        page: currentPage,
        limit,
      });
      
      setProducts(response.items);
      setTotal(response.total);
      setTotalPages(response.pages);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  // Handle brand selection
  const handleMarkaChange = (marka: string) => {
    setSelectedMarka(marka);
    setSelectedModel('');
    setSelectedGeneration('');
    setSelectedPartType('');
    setCurrentPage(1);
  };

  // Handle model selection
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedGeneration('');
    setSelectedPartType('');
    setCurrentPage(1);
  };

  // Handle generation selection
  const handleGenerationChange = (generation: string) => {
    setSelectedGeneration(generation);
    setSelectedPartType('');
    setCurrentPage(1);
  };

  const handlePartTypeChange = (partType: string) => {
    setSelectedPartType(partType);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedMarka('');
    setSelectedModel('');
    setSelectedGeneration('');
    setSelectedPartType('');
    setCurrentPage(1);
    navigate('/catalog', { replace: true });
  };

  // Get available models for selected brand
  const availableModels = selectedMarka && categories 
    ? categories.modelsByBrand[selectedMarka] || []
    : [];

  // Get available generations for selected brand-model
  const availableGenerations = selectedMarka && selectedModel && categories
    ? categories.generationsByModel[`${selectedMarka}-${selectedModel}`] || []
    : [];

  if (error) {
    return (
      <div className="catalog-page">
        <div className="catalog-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
        <div className="catalog-header">
            <h1>Каталог запчастей</h1>
            {nameKeyword && (
                <div className="catalog-search-info">
                <p>
                    Поиск: <strong>{nameKeyword}</strong>
                </p>
                <button className="clear-search-btn" onClick={resetFilters}>
                    ✕ Очистить поиск
                </button>
                </div>
            )}
            <p className="catalog-subtitle">
                Найдено товаров: <strong>{total}</strong>
            </p>
        </div>

        {/* Search Section */}
        <div className="catalog-search-section">
        <h3 className="catalog-search-title">Поиск товаров</h3>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }} className="catalog-search-form">
            <input
            type="text"
            className="catalog-search-input"
            placeholder="Введите артикул или OEM номер"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="catalog-search-button">
            Найти
            </button>
        </form>
        </div>

      {/* Filters */}
      <div className="catalog-filters">
        <div className="filter-group">
          <label htmlFor="marka-select">Марка автомобиля:</label>
          <select
            id="marka-select"
            className="filter-select"
            value={selectedMarka}
            onChange={(e) => handleMarkaChange(e.target.value)}
            disabled={!categories}
          >
            <option value="">Все марки</option>
            {categories?.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="model-select">Модель:</label>
          <select
            id="model-select"
            className="filter-select"
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!selectedMarka || availableModels.length === 0}
          >
            <option value="">Все модели</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="generation-select">Поколение:</label>
          <select
            id="generation-select"
            className="filter-select"
            value={selectedGeneration}
            onChange={(e) => handleGenerationChange(e.target.value)}
            disabled={!selectedModel || availableGenerations.length === 0}
          >
            <option value="">Все поколения</option>
            {availableGenerations.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="part-type-select">Тип запчасти:</label>
          <select
            id="part-type-select"
            className="filter-select"
            value={selectedPartType}
            onChange={(e) => handlePartTypeChange(e.target.value)}
            disabled={loadingTypes || availablePartTypes.length === 0}
          >
            <option value="">Все типы{availablePartTypes.length > 0 ? ` (${availablePartTypes.length})` : ''}</option>
            {availablePartTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {(selectedMarka || selectedModel || selectedGeneration || selectedPartType) && (
          <div className="filter-actions">
            <button 
              className="show-results-btn" 
              onClick={() => {
                const resultsElement = document.querySelector('.products-grid');
                if (resultsElement) {
                  resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Показать
            </button>
            <button className="reset-filters-btn" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="catalog-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка товаров...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="catalog-empty">
          <p>Товары не найдены</p>
          {(selectedMarka || selectedModel || selectedGeneration || selectedPartType) && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="catalog-pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Предыдущая
              </button>
              
              <div className="pagination-info">
                Страница {currentPage} из {totalPages}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Следующая →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
