import './ContactsPage.css';

const ContactsPage = () => {
  return (
    <div className="contacts-page">
      <div className="contacts-container">
        <div className="contacts-header">
          <h1 className="contacts-title">Контакты</h1>
          <p className="contacts-subtitle">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="contacts-grid">
          <div className="contacts-info">
            <div className="contact-card">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor"/>
                </svg>
              </div>
              <h3 className="contact-title">Адрес</h3>
              <p className="contact-text">г Москва, ул. Ленина, д. 10</p>
              <p className="contact-text-small">Офис открыт: Пн-Пт 9:00-18:00</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor"/>
                </svg>
              </div>
              <h3 className="contact-title">Телефон</h3>
              <p className="contact-text">+7 (495) 123-45-67</p>
              <p className="contact-text-small">Звонки принимаются ежедневно</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor"/>
                </svg>
              </div>
              <h3 className="contact-title">Email</h3>
              <p className="contact-text">info@example.com</p>
              <p className="contact-text-small">Ответим в течение 24 часов</p>
            </div>
          </div>

          <div className="contacts-form-section">
            <div className="form-card">
              <h2 className="form-title">Напишите нам</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Ваше имя</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="form-input" 
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-input" 
                    placeholder="ivan@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Телефон</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="form-input" 
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Сообщение</label>
                  <textarea 
                    id="message" 
                    className="form-textarea" 
                    rows={5}
                    placeholder="Опишите ваш вопрос или запрос..."
                  ></textarea>
                </div>

                <button type="submit" className="form-submit">
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;

