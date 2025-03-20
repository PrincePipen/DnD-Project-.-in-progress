import React from 'react';
import './Card.css';

/**
 * Card component for containing content
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card component
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  elevated = false,
  ...rest
}) => {
  const cardClasses = `card ${elevated ? 'card-elevated' : ''} ${className}`;

  return (
    <div className={cardClasses} {...rest}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;