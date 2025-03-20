import React from 'react';
import './Button.css';

/**
 * Reusable button component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Button component
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;