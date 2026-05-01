import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  COOKIE_CONSENT_STORAGE_NAME,
  COOKIE_CONSENT_NOTICE_VERSION,
  recordCookieConsent,
} from '../../api/consents';
import './CookieConsentBanner.css';

const CONSENT_MAX_AGE_SEC = 365 * 24 * 60 * 60;

function readConsentCookie(): boolean {
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(COOKIE_CONSENT_STORAGE_NAME)}=([^;]*)`),
  );
  if (!m) return false;
  try {
    const val = decodeURIComponent(m[1]);
    return val === '1' || val.startsWith(COOKIE_CONSENT_NOTICE_VERSION);
  } catch {
    return false;
  }
}

/** Техническая cookie: пометка о полученном согласии (после успешной записи на сервере). */
export function setTechnicalConsentCookie(): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(COOKIE_CONSENT_STORAGE_NAME)}=${encodeURIComponent(
    COOKIE_CONSENT_NOTICE_VERSION,
  )}; Path=/; Max-Age=${CONSENT_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (readConsentCookie()) return;
    setVisible(true);
  }, []);

  const handleAccept = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await recordCookieConsent();
      setTechnicalConsentCookie();
      setVisible(false);
    } catch (e) {
      console.error('Cookie consent log failed:', e);
      setError('Не удалось сохранить ответ на сервере. Проверьте подключение и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="cookie-consent-banner"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text" id="cookie-consent-desc">
          <strong id="cookie-consent-title">Файлы cookie и обработка данных</strong>
          <p>
            При первом посещении сайта мы информируем вас: при работе сайта осуществляется автоматическая
            обработка данных о посещении, в том числе с использованием{' '}
            <span className="cookie-consent-em">файлов cookie</span> (включая технические cookie, необходимые
            для фиксации вашего выбора).
          </p>
          <p className="cookie-consent-links">
            <Link to="/personal-data" className="cookie-consent-link">
              Обработка персональных данных
            </Link>
          </p>
          {error && <p className="cookie-consent-error">{error}</p>}
        </div>
        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-consent-accept"
            onClick={handleAccept}
            disabled={submitting}
          >
            {submitting ? 'Сохранение…' : 'Хорошо'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
