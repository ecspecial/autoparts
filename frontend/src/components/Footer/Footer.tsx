import { Link } from 'react-router-dom';
import './Footer.css';
import { getSiteLogoUrl } from '../../utils/siteLogo';

/** Ссылка-приглашение в MAX; задайте VITE_MAX_CONTACT_URL в .env (например https://max.ru/join/...) */
const MAX_CONTACT_HREF =
  (import.meta.env.VITE_MAX_CONTACT_URL as string | undefined)?.trim() ||
  'https://max.ru/u/f9LHodD0cOIaEIgwT_5GFd6lQnBd-X01QzawHH2ZqSv4X0s34SyxbBoEJj0';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoUrl = getSiteLogoUrl();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <Link to="/" className="footer-logo">
              <img src={logoUrl} alt="Forward Autoparts" className="footer-logo-img" />
            </Link>
            <p className="footer-description">
              Кузовные запчасти для всех марок автомобилей. Качество и надёжность.
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Компания</h3>
            <ul className="footer-links">
              <li><Link to="/about">О компании</Link></li>
                <li><Link to="/contacts">Контакты</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/downloads">Прайс-лист</Link></li>
              <li><Link to="/warranty">Гарантия и возврат</Link></li>   
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Контакты</h3>
            <ul className="footer-contacts">
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor"/>
                </svg>
                <a href="tel:+79089163135">8 (908) 916-31-35</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor"/>
                </svg>
                <a href="mailto:ekat@autobody.ru">ekat@autobody.ru</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor"/>
                </svg>
                <span>г. Екатеринбург, ул. Бархотская 2/2</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor"/>
                </svg>
                <span>Пн–Пт: 09:00–18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-middle">
          <div className="footer-social">
            <a
              href={MAX_CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-max-btn"
              aria-label="MAX"
              title="Написать в MAX"
            >
              <svg
                className="footer-social-max-svg"
                viewBox="0 0 1000 1000"
                width="26"
                height="26"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="1000" height="1000" rx="250" fill="#5846f5" />
                <path
                  fill="#ffffff"
                  fillRule="evenodd"
                  d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <Link to="/privacy">Политика конфиденциальности</Link>
          </div>
          <div className="footer-copyright">
            © {currentYear} Forward Autoparts. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;