import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Страница не найдена</h2>
          <p className="not-found-description">
            К сожалению, запрашиваемая вами страница не существует или была перемещена
          </p>
          <Link to="/" className="not-found-button">
            На главную
          </Link>
        </div>
        <div className="not-found-illustration">
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
            <path d="M60 90 L80 110 M80 90 L60 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M120 90 L140 110 M140 90 L120 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M75 140 Q100 120 125 140" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

