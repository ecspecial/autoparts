import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CarIcon from '../icons/CarIcon';
import './Header.css';
import { useCart } from '../../context/CartContext';  // ← Add at top


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
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
          <Link to="/catalog" className={`header-nav-link ${location.pathname.startsWith('/catalog') || location.pathname.startsWith('/product') ? 'active' : ''}`}>
            Каталог
          </Link>
          <Link to="/about" className={`header-nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            О компании
          </Link>
          <Link to="/contacts" className={`header-nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}>
            Контакты
          </Link>
          <Link to="/downloads" className={`header-nav-link ${location.pathname === '/downloads' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Прайс-лист
          </Link>
          
          {/* Auth-based navigation */}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`header-nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={closeMobileMenu}>
                Профиль
              </Link>
              <Link to="/cart" className="header-cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Корзина
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}  {/* ← Add badge */}
              </Link>
              <button onClick={logout} className="header-logout-button">
                Выход
              </button>
            </>
          ) : (
            <Link to="/login" className={`header-nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Вход
            </Link>
          )}
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
        <Link to="/downloads" className={`mobile-menu-link ${location.pathname === '/downloads' ? 'active' : ''}`} onClick={closeMobileMenu}>
          Прайс-лист
        </Link>
        
        {/* Auth-based mobile navigation */}
        {isAuthenticated ? (
          <>
            <Link to="/profile" className={`mobile-menu-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={closeMobileMenu}>
              Профиль
            </Link>
            <Link to="/cart" className={`mobile-menu-link ${location.pathname === '/cart' ? 'active' : ''}`} onClick={closeMobileMenu}>
              Корзина
            </Link>
            <button onClick={handleLogout} className="mobile-menu-logout">
              Выход
            </button>
          </>
        ) : (
          <Link to="/login" className={`mobile-menu-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Вход
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;