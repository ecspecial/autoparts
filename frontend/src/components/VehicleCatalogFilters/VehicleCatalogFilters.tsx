import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { CategoriesResponse } from '../../api/products';
import './VehicleCatalogFilters.css';

/**
 * Блок фильтров марка / модель / поколение / тип — для главной: переход в каталог с выбранными параметрами.
 */
const VehicleCatalogFilters = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [selectedMarka, setSelectedMarka] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [selectedPartType, setSelectedPartType] = useState('');
  const [availablePartTypes, setAvailablePartTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    productsApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories(null));
  }, []);

  useEffect(() => {
    if (!selectedMarka && !selectedModel && !selectedGeneration) {
      setAvailablePartTypes([]);
      return;
    }
    setLoadingTypes(true);
    productsApi
      .getAvailableTypes({
        marka: selectedMarka || undefined,
        model: selectedModel || undefined,
        generation: selectedGeneration || undefined,
      })
      .then((types) => {
        setAvailablePartTypes(types);
        if (selectedPartType && !types.includes(selectedPartType)) {
          setSelectedPartType('');
        }
      })
      .catch(() => setAvailablePartTypes([]))
      .finally(() => setLoadingTypes(false));
  }, [selectedMarka, selectedModel, selectedGeneration]);

  const availableModels =
    selectedMarka && categories ? categories.modelsByBrand[selectedMarka] || [] : [];
  const availableGenerations =
    selectedMarka && selectedModel && categories
      ? categories.generationsByModel[`${selectedMarka}-${selectedModel}`] || []
      : [];

  const handleOpenCatalog = () => {
    const params = new URLSearchParams();
    if (selectedMarka) params.set('marka', selectedMarka);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedGeneration) params.set('generation', selectedGeneration);
    if (selectedPartType) params.set('type', selectedPartType);
    const qs = params.toString();
    navigate(qs ? `/catalog?${qs}` : '/catalog');
  };

  const handleReset = () => {
    setSelectedMarka('');
    setSelectedModel('');
    setSelectedGeneration('');
    setSelectedPartType('');
  };

  return (
    <section className="vehicle-catalog-filters">
      <div className="vehicle-catalog-filters__inner">
        <h2 className="vehicle-catalog-filters__title">Подбор по автомобилю</h2>
        <p className="vehicle-catalog-filters__hint">
          Выберите марку, модель и при необходимости поколение и тип запчасти — откроется каталог с подходящими позициями.
        </p>

        <div className="vehicle-catalog-filters__grid">
          <div className="vehicle-catalog-filters__group">
            <label htmlFor="home-marka">Марка</label>
            <select
              id="home-marka"
              className="vehicle-catalog-filters__select"
              value={selectedMarka}
              onChange={(e) => {
                setSelectedMarka(e.target.value);
                setSelectedModel('');
                setSelectedGeneration('');
                setSelectedPartType('');
              }}
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

          <div className="vehicle-catalog-filters__group">
            <label htmlFor="home-model">Модель</label>
            <select
              id="home-model"
              className="vehicle-catalog-filters__select"
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedGeneration('');
                setSelectedPartType('');
              }}
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

          <div className="vehicle-catalog-filters__group">
            <label htmlFor="home-gen">Поколение</label>
            <select
              id="home-gen"
              className="vehicle-catalog-filters__select"
              value={selectedGeneration}
              onChange={(e) => {
                setSelectedGeneration(e.target.value);
                setSelectedPartType('');
              }}
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

          <div className="vehicle-catalog-filters__group">
            <label htmlFor="home-type">Тип запчасти</label>
            <select
              id="home-type"
              className="vehicle-catalog-filters__select"
              value={selectedPartType}
              onChange={(e) => setSelectedPartType(e.target.value)}
              disabled={loadingTypes || availablePartTypes.length === 0}
            >
              <option value="">
                Все типы
                {availablePartTypes.length > 0 ? ` (${availablePartTypes.length})` : ''}
              </option>
              {availablePartTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="vehicle-catalog-filters__actions">
          <button type="button" className="vehicle-catalog-filters__btn-primary" onClick={handleOpenCatalog}>
            Открыть каталог
          </button>
          {(selectedMarka || selectedModel || selectedGeneration || selectedPartType) && (
            <button type="button" className="vehicle-catalog-filters__btn-secondary" onClick={handleReset}>
              Сбросить
            </button>
          )}
          <Link to="/catalog" className="vehicle-catalog-filters__link">
            Перейти в полный каталог →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehicleCatalogFilters;
