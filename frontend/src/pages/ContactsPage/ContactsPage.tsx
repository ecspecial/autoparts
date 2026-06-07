import { getSiteContacts } from '../../utils/siteContacts';
import './ContactsPage.css';

const ContactsPage = () => {
  const contacts = getSiteContacts();

  return (
    <div className="contacts-page">
      <div className="contacts-container">
        <div className="contacts-header">
          <h1 className="contacts-title">Контакты</h1>
          <p className="contacts-subtitle">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="contacts-two-col">
          {/* Left box — Contact Info */}
          <div className="contact-box">
            <h2 className="contact-box-title">Связаться с нами</h2>

            <div className="contact-row">
              <div className="contact-row-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 className="contact-row-label">Телефон</h3>
                <p className="contact-row-value">
                  <a href={contacts.phoneHref}>{contacts.phone}</a>
                </p>
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-row-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 className="contact-row-label">Email</h3>
                <p className="contact-row-value">
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                </p>
                {contacts.emailClients && (
                  <>
                    <p className="contact-row-sub">Отдел по работе с клиентами:</p>
                    <p className="contact-row-value">
                      <a href={`mailto:${contacts.emailClients}`}>{contacts.emailClients}</a>
                    </p>
                  </>
                )}
              </div>
            </div>

            {contacts.telegram && contacts.telegramHref && (
              <div className="contact-row">
                <div className="contact-row-icon contact-icon-telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="contact-row-label">Telegram</h3>
                  <p className="contact-row-value">
                    <a href={contacts.telegramHref} target="_blank" rel="noopener noreferrer">
                      {contacts.telegram}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right box — Location & Hours */}
          <div className="contact-box">
            <h2 className="contact-box-title">Адрес и время работы</h2>

            <div className="contact-row">
              <div className="contact-row-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 className="contact-row-label">Адрес</h3>
                <p className="contact-row-value">{contacts.address}</p>
                {contacts.yandexRouteHref && (
                  <div className="contacts-yandex-route contacts-yandex-route--mobile-only">
                    <a
                      href={contacts.yandexRouteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contacts-yandex-route-btn"
                    >
                      Проложить маршрут на карте
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-row-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 className="contact-row-label">Время работы</h3>
                <p className="contact-row-value">{contacts.hoursWeekdays}</p>
                <p className="contact-row-value">{contacts.hoursSaturday}</p>
                <p className="contact-row-value">{contacts.hoursSunday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
