import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import './AuthPage.css';

type AuthMode = 'login' | 'register';
type EntityType = 'individual' | 'legal';

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('individual');
  const [fullName, setFullName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Captcha state
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaText('');
    try {
      const data = await authApi.getCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
    } catch (err) {
      console.error('Failed to load captcha:', err);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Load captcha when switching to register mode
  useEffect(() => {
    if (mode === 'register') {
      loadCaptcha();
    }
  }, [mode, loadCaptcha]);

  const handleInvalidRequired = (e: React.FormEvent<HTMLInputElement>, msg: string) => {
    const input = e.target as HTMLInputElement;
    if (input.validity.valueMissing) {
      input.setCustomValidity(msg);
    } else {
      input.setCustomValidity('');
    }
  };

  const handleInputClear = (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!consentChecked) {
        setError('Необходимо дать согласие на обработку персональных данных');
        return;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
      if (password.length < 8) {
        setError('Пароль должен содержать минимум 8 символов');
        return;
      }
      if (!fullName.trim()) {
        setError(entityType === 'individual' ? 'Введите ФИО' : 'Введите наименование организации');
        return;
      }
      if (!captchaText.trim()) {
        setError('Введите текст с картинки');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await authLogin(email, password);
      } else {
        await authRegister({
          password,
          phone,
          email,
          entityType,
          fullName,
          captchaId,
          captchaText,
        });
      }
      navigate('/');
    } catch (err: any) {
      const msg = err.message || `Ошибка ${mode === 'login' ? 'входа' : 'регистрации'}`;
      setError(msg);
      // If captcha failed, load a new one
      if (mode === 'register') {
        loadCaptcha();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
    setConsentChecked(false);
    setCaptchaText('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={mode === 'register' ? { maxWidth: '480px' } : undefined}>
        <h1>{mode === 'login' ? 'Вход в систему' : 'Регистрация'}</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              placeholder="user@example.com"
              onInvalid={(e) => handleInvalidRequired(e, 'Пожалуйста, введите email')}
              onInput={handleInputClear}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onInvalid={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.validity.tooShort) {
                  input.setCustomValidity('Пароль должен содержать минимум 8 символов');
                } else if (input.validity.valueMissing) {
                  input.setCustomValidity('Пожалуйста, введите пароль');
                } else {
                  input.setCustomValidity('');
                }
              }}
              onInput={handleInputClear}
            />
            {mode === 'register' && <small>Минимум 8 символов</small>}
            {mode === 'login' && (
              <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <Link to="/forgot-password" className="mode-link" style={{ fontSize: '0.9rem' }}>
                  Забыли пароль?
                </Link>
              </p>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  autoComplete="new-password"
                  onInvalid={(e) => handleInvalidRequired(e, 'Подтвердите пароль')}
                  onInput={handleInputClear}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="+7 (999) 123-45-67"
                  onInvalid={(e) => handleInvalidRequired(e, 'Пожалуйста, введите телефон')}
                  onInput={handleInputClear}
                />
              </div>

              <div className="form-group">
                <label>Форма взаимодействия</label>
                <div className="entity-type-selector">
                  <label className="entity-type-option">
                    <input
                      type="radio"
                      name="entityType"
                      value="individual"
                      checked={entityType === 'individual'}
                      onChange={() => { setEntityType('individual'); setFullName(''); }}
                      disabled={isLoading}
                    />
                    <span>Физическое лицо</span>
                  </label>
                  <label className="entity-type-option">
                    <input
                      type="radio"
                      name="entityType"
                      value="legal"
                      checked={entityType === 'legal'}
                      onChange={() => { setEntityType('legal'); setFullName(''); }}
                      disabled={isLoading}
                    />
                    <span>Юридическое лицо</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">
                  {entityType === 'individual' ? 'ФИО' : 'Наименование организации'}
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder={
                    entityType === 'individual'
                      ? 'Иванов Иван Иванович'
                      : 'ООО "Название организации"'
                  }
                  onInvalid={(e) => handleInvalidRequired(e,
                    entityType === 'individual' ? 'Введите ФИО' : 'Введите наименование организации'
                  )}
                  onInput={handleInputClear}
                />
              </div>

              {/* SVG Captcha */}
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
                  onInvalid={(e) => handleInvalidRequired(e, 'Введите текст с картинки')}
                  onInput={handleInputClear}
                />
              </div>

              <div className="consent-group">
                <label className="consent-label">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    disabled={isLoading}
                    className="consent-checkbox"
                  />
                  <span className="consent-text">
                    Нажимая кнопку «Зарегистрироваться», я даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года № 152-ФЗ «О персональных данных», на условиях и для целей, определенных в{' '}
                    <a
                      href="/personal-data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="consent-link"
                    >
                      Согласии на обработку персональных данных
                    </a>
                  </span>
                </label>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading 
              ? (mode === 'login' ? 'Вход...' : 'Регистрация...') 
              : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')
            }
          </button>
        </form>

        <p className="toggle-mode">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button 
            type="button" 
            onClick={switchMode} 
            className="mode-link"
            disabled={isLoading}
          >
            {mode === 'login' ? 'Регистрация' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;