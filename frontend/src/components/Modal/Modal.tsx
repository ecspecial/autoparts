import { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'success' | 'info';
}

export default function Modal({ isOpen, onClose, title, message, type = 'info' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${type}`} onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        <button className="modal-close" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}