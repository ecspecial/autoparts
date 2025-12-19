import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchSection.css';

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <h1 className="search-title">
          Запчасти для вашего автомобиля
        </h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Введите артикул"
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

