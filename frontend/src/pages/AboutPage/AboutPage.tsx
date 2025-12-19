import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">О компании</h1>
          <p className="about-lead">
            Мы специализируемся на поставке качественных кузовных запчастей для всех марок автомобилей
          </p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Наша миссия</h2>
            <p className="section-text">
              Обеспечить доступ к оригинальным и качественным запчастям для кузова автомобиля по честным ценам. 
              Мы стремимся сделать процесс ремонта максимально простым и быстрым для наших клиентов.
            </p>
          </section>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Лет на рынке</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50 000+</div>
              <div className="stat-label">Довольных клиентов</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100 000+</div>
              <div className="stat-label">Запчастей в каталоге</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Поддержка клиентов</div>
            </div>
          </div>

          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Почему выбирают нас</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3 className="feature-title">Гарантия качества</h3>
                <p className="feature-text">
                  Все запчасти сертифицированы и соответствуют стандартам качества. 
                  Предоставляем официальную гарантию на все товары.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="feature-title">Широкий ассортимент</h3>
                <p className="feature-text">
                  Более 100 000 наименований запчастей для всех популярных марок и моделей автомобилей.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="feature-title">Быстрая доставка</h3>
                <p className="feature-text">
                  Доставка по Москве в день заказа. Отправка в регионы транспортными компаниями.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="feature-title">Выгодные цены</h3>
                <p className="feature-text">
                  Работаем напрямую с производителями, что позволяет предлагать лучшие цены на рынке.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Наша команда</h2>
            <p className="section-text">
              В нашей компании работают профессионалы с многолетним опытом в автомобильной индустрии. 
              Каждый сотрудник проходит регулярное обучение и повышение квалификации, чтобы обеспечить 
              высочайший уровень сервиса для наших клиентов.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

