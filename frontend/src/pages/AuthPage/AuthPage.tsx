import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

type AuthMode = 'login' | 'register';

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const handleInvalidLogin = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (input.validity.valueMissing) {
      input.setCustomValidity('Пожалуйста, введите логин');
    } else {
      input.setCustomValidity('');
    }
  };

  const handleLoginInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.setCustomValidity('');
  };

  const handleInvalidPassword = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (input.validity.tooShort) {
      input.setCustomValidity('Пароль должен содержать минимум 8 символов');
    } else if (input.validity.valueMissing) {
      input.setCustomValidity('Пожалуйста, введите пароль');
    } else {
      input.setCustomValidity('');
    }
  };

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.setCustomValidity('');
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
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await authLogin(login, password);
      } else {
        await authRegister(login, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || `Ошибка ${mode === 'login' ? 'входа' : 'регистрации'}`);
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
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{mode === 'login' ? 'Вход в систему' : 'Регистрация'}</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              onInvalid={handleInvalidLogin}
              onInput={handleLoginInput}
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
              onInvalid={handleInvalidPassword}
              onInput={handlePasswordInput}
            />
            {mode === 'register' && <small>Минимум 8 символов</small>}
          </div>

          {mode === 'register' && (
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
                onInvalid={handleInvalidPassword}
                onInput={handlePasswordInput}
              />
            </div>
          )}

          {mode === 'register' && (
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
                  Нажимая кнопку «Отправить на регистрацию», я даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года № 152-ФЗ «О персональных данных», на условиях и для целей, определенных в{' '}
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
