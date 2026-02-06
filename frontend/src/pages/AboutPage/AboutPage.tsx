import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">О компании</h1>
          <p className="about-lead">
            Компания «Форвард Екатеринбург» специализируется в области поставок и дистрибъюции запчастей.
          </p>
        </div>

        <div className="about-content">
          {/* Main assortment */}
          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Наш основной ассортимент</h2>
            <p className="section-text section-subtitle">Кузовные детали на легковые автомобили и легкий коммерческий транспорт:</p>
            <ul className="about-list">
              <li>Капоты</li>
              <li>Крылья передние</li>
              <li>Крылья задние</li>
              <li>Двери передние</li>
              <li>Двери задние</li>
              <li>Крышки багажника</li>
              <li>Панель крыши</li>
              <li>Боковины кузова целиком</li>
              <li>Бампера передние</li>
              <li>Бампера задние</li>
              <li>Подкрылки (локеры), брызговики, пластиковые защиты поддона</li>
            </ul>
          </section>

          {/* Additional products */}
          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">А также мы можем предложить</h2>
            <ul className="about-list">
              <li>Системы освещения (Фары головного света, указатели поворота, противотуманные фары, задние фонари, стекла фар, корпуса фар)</li>
              <li>Системы охлаждения (Мотор печек, радиаторы, вентиляторы радиатора)</li>
              <li>Бочки омывателя, форсунки и заглушки к ним</li>
              <li>Зеркала заднего вида и решетки радиаторов</li>
            </ul>
          </section>

          {/* Warehouse & suppliers */}
          <section className="about-section">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" stroke="currentColor"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor"/>
                <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor"/>
                <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Склад и поставки</h2>
            <p className="section-text">
              На складе в Екатеринбурге площадью 4 500 кв. в наличии более 10 000 видов номенклатуры. Поставки осуществляются от ведущих производителей Китая, Тайваня, Турции, Аргентины.
            </p>
          </section>

          {/* Terms grid */}
          <div className="about-terms-grid">
            <div className="about-term-card">
              <h3 className="about-term-title">Система скидок</h3>
              <p className="about-term-text">В зависимости от оборота</p>
            </div>
            <div className="about-term-card">
              <h3 className="about-term-title">Форма оплаты</h3>
              <p className="about-term-text">Наличный расчет, безналичный расчёт, QR код.</p>
            </div>
            <div className="about-term-card">
              <h3 className="about-term-title">Сроки оплаты</h3>
              <p className="about-term-text">Возможна отсрочка платежа постоянным клиентам.</p>
            </div>
            <div className="about-term-card">
              <h3 className="about-term-title">Тип доставки</h3>
              <p className="about-term-text">Самовывоз, доставка по г. Екатеринбург – бесплатно. Доставка до транспортной компании – бесплатно (доставку можно согласовать с нашими Менеджерами после оформления заказа).</p>
            </div>
          </div>

          {/* Collaboration invite */}
          <section className="about-section about-invite">
            <div className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/>
              </svg>
            </div>
            <h2 className="section-title">Приглашаем к сотрудничеству</h2>
            <p className="section-text">
              Мы приглашаем к сотрудничеству интернет магазины, автосервисы, таксопарки, магазины автозапчастей, страховые компании, официальных дилеров по продаже а/м и частных предпринимателей в сфере автозапчастей.
            </p>

            <div className="about-contacts-block">
              <div className="about-contact-item">
                <span className="about-contact-label">Тел для заказов и всех вопросов:</span>
                <a href="tel:+79089163135" className="about-contact-value">+7 908 916 31 35</a>
              </div>
              <div className="about-contact-item">
                <span className="about-contact-label">E-mail для заказов:</span>
                <a href="mailto:ekat@autobody.ru" className="about-contact-value">ekat@autobody.ru</a>
              </div>
              <div className="about-contact-item">
                <span className="about-contact-label">E-mail для обратной связи и сотрудничества:</span>
                <a href="mailto:ekb.autobody2@gmail.com" className="about-contact-value">ekb.autobody2@gmail.com</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
