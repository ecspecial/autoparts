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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация для режима регистрации
    if (mode === 'register') {
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
      navigate('/'); // Перенаправляем на домашнюю страницу после успешного входа
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
              />
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