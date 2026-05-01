import { Link } from 'react-router-dom';
import './PersonalDataConsentField.css';

type PersonalDataConsentFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: 'default' | 'cart';
};

/**
 * Общий блок согласия на обработку ПД (ссылка на страницу с текстом согласия).
 */
export function PersonalDataConsentField({
  id,
  checked,
  onChange,
  variant = 'default',
}: PersonalDataConsentFieldProps) {
  const rootClass =
    variant === 'cart'
      ? 'pd-consent pd-consent--cart'
      : 'pd-consent';

  return (
    <label className={rootClass} htmlFor={id}>
      <input
        id={id}
        className="pd-consent-input"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="pd-consent-text">
        Я согласен(на) на{' '}
        <Link to="/personal-data" className="pd-consent-link" target="_blank" rel="noopener noreferrer">
          обработку персональных данных
        </Link>
      </span>
    </label>
  );
}
