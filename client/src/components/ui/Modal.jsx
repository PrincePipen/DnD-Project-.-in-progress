import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal dialog component
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Modal component or null if not open
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'medium',
  closeOnEscape = true,
  closeOnOutsideClick = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (closeOnEscape && isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle outside click
  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && event.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleOutsideClick}>
      <div className={`modal modal-${size} ${className}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;