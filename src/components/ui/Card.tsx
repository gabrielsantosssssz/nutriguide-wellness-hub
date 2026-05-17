import React from 'react';

interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'outlined',
  hoverable = false,
  padding = 'md',
  className = '',
  children,
  onClick,
}) => {
  const variants: Record<string, string> = {
    elevated: 'bg-surface-container-lowest shadow-[0_2px_12px_rgba(7,30,39,0.06)] border border-transparent',
    outlined: 'bg-surface-container-lowest border border-outline-variant',
    filled: 'bg-surface-container-low border border-transparent',
  };

  const paddings: Record<string, string> = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hoverable
    ? 'hover:shadow-[0_4px_24px_rgba(13,99,27,0.08)] hover:border-primary/30 transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
