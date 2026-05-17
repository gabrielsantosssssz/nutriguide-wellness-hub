import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-label-lg text-label-lg rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-[0_2px_8px_rgba(13,99,27,0.15)] hover:shadow-[0_4px_16px_rgba(13,99,27,0.25)]',
    secondary: 'bg-secondary text-on-secondary hover:opacity-90',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-body-sm min-h-[36px]',
    md: 'px-6 py-3 min-h-[48px]',
    lg: 'px-8 py-4 text-body-lg min-h-[56px]',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
};

export default Button;
