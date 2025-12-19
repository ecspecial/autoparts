import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CarIcon from '../icons/CarIcon';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <CarIcon className="header-logo-svg" width={40} height={40} />
          <span className="header-logo-text">AutoParts</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/catalog" className={`header-nav-link ${location.pathname.startsWith('/catalog') || location.pathname.startsWith('/product') ? 'active' : ''}`}>Каталог</Link>
          <Link to="/about" className={`header-nav-link ${location.pathname === '/about' ? 'active' : ''}`}>О компании</Link>
          <Link to="/contacts" className={`header-nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}>Контакты</Link>
          <Link to="/profile" className={`header-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Профиль</Link>
          <Link to="/cart" className={`header-nav-link ${location.pathname === '/cart' ? 'active' : ''}`}>Корзина</Link>
        </nav>

        {/* Hamburger Button */}
        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu Drawer */}
      <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/catalog" className={`mobile-menu-link ${location.pathname.startsWith('/catalog') || location.pathname.startsWith('/product') ? 'active' : ''}`} onClick={closeMobileMenu}>
          Каталог
        </Link>
        <Link to="/about" className={`mobile-menu-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>
          О компании
        </Link>
        <Link to="/contacts" className={`mobile-menu-link ${location.pathname === '/contacts' ? 'active' : ''}`} onClick={closeMobileMenu}>
          Контакты
        </Link>
        <Link to="/profile" className={`mobile-menu-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={closeMobileMenu}>
          Профиль
        </Link>
        <Link to="/cart" className={`mobile-menu-link ${location.pathname === '/cart' ? 'active' : ''}`} onClick={closeMobileMenu}>
          Корзина
        </Link>
      </nav>
    </header>
  );
};

export default Header;
