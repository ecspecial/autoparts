import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth';
import '../AuthPage/AuthPage.css';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('В ссылке нет токена. Запросите новое письмо на странице восстановления пароля.');
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
    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, password });
      setSuccess(res.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(ax.response?.data?.message)
        ? ax.response?.data?.message?.[0]
        : ax.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Не удалось сменить пароль');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Сброс пароля</h1>
          <div className="error-message">
            Ссылка недействительна или устарела. Запросите новое письмо.
          </div>
          <p className="toggle-mode">
            <Link to="/forgot-password" className="mode-link">
              Восстановить пароль
            </Link>
            {' · '}
            <Link to="/login" className="mode-link">
              Вход
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Новый пароль</h1>
        <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.95rem' }}>
          Придумайте новый пароль для входа в аккаунт.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="rp-password">Новый пароль</label>
            <input
              type="password"
              id="rp-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <small>Минимум 8 символов</small>
          </div>
          <div className="form-group">
            <label htmlFor="rp-confirm">Подтвердите пароль</label>
            <input
              type="password"
              id="rp-confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div
              className="error-message"
              style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' }}
            >
              {success}{' '}
              <Link to="/login" style={{ color: '#1565c0' }}>
                Перейти ко входу
              </Link>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading || !!success}>
            {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
          </button>
        </form>

        <p className="toggle-mode">
          <Link to="/login" className="mode-link">
            ← Вход
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
