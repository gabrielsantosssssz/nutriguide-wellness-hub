import React from 'react';

interface BadgeProps {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'filled',
  color = 'primary',
  children,
  icon,
  className = '',
}) => {
  const filledColors: Record<string, string> = {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-surface-container-high text-on-surface',
    neutral: 'bg-surface-container text-on-surface',
  };

  const outlinedColors: Record<string, string> = {
    primary: 'border border-primary text-primary',
    secondary: 'border border-secondary text-secondary',
    tertiary: 'border border-tertiary text-tertiary',
    neutral: 'border border-outline-variant text-on-surface-variant',
  };

  const colorClasses = variant === 'filled' ? filledColors[color] : outlinedColors[color];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-label-md ${colorClasses} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
