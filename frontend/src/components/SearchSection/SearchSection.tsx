import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchSection.css';

type SearchType = 'article' | 'oem';

const SearchSection = () => {
  const [searchType, setSearchType] = useState<SearchType>('article');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const type = searchType === 'oem' ? 'oem' : 'query';
      navigate(`/search?${type}=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <h1 className="search-title">
          Запчасти для вашего автомобиля
        </h1>
        
        {/* Search Type Toggle */}
        <div className="search-tabs">
          <button
            type="button"
            className={`search-tab ${searchType === 'article' ? 'active' : ''}`}
            onClick={() => setSearchType('article')}
          >
            Поиск по артикулу
          </button>
          <button
            type="button"
            className={`search-tab ${searchType === 'oem' ? 'active' : ''}`}
            onClick={() => setSearchType('oem')}
          >
            Поиск по OEM
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder={
              searchType === 'article' 
                ? 'Введите  артикул (например: KARIO17-520)' 
                : 'Введите OEM номер (например: 6001546685)'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            Поиск
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;