import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import '../AuthPage/AuthPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaText('');
    try {
      const data = await authApi.getCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
    } catch {
      setError('Не удалось загрузить капчу');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!captchaText.trim()) {
      setError('Введите текст с картинки');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({
        email,
        captchaId,
        captchaText,
      });
      setSuccess(res.message);
      setEmail('');
      loadCaptcha();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(ax.response?.data?.message)
        ? ax.response?.data?.message?.[0]
        : ax.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Не удалось отправить запрос');
      loadCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Восстановление пароля</h1>
        <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.95rem' }}>
          Укажите email, с которым вы регистрировались. Мы отправим ссылку для сброса пароля.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fp-email">Email</label>
            <input
              type="email"
              id="fp-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label>Введите текст с картинки</label>
            <div className="captcha-block">
              <div className="captcha-image">
                {captchaLoading ? (
                  <div className="captcha-loading">Загрузка...</div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
                )}
              </div>
              <button
                type="button"
                className="captcha-refresh-btn"
                onClick={loadCaptcha}
                disabled={captchaLoading || isLoading}
                title="Получить новую капчу"
              >
                ↻ Новая
              </button>
            </div>
            <input
              type="text"
              value={captchaText}
              onChange={(e) => setCaptchaText(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Введите символы"
              autoComplete="off"
              className="captcha-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="error-message" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' }}>
              {success}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
        </form>

        <p className="toggle-mode">
          <Link to="/login" className="mode-link">
            ← Вернуться ко входу
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
