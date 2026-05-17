import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'primary',
  label,
  showPercentage = false,
  animated = true,
  height = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colors: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
  };

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
          )}
          {showPercentage && (
            <span className="font-label-md text-label-md text-on-surface-variant">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-surface-variant rounded-full ${heights[height]} overflow-hidden`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progresso: ${percentage}%`}
      >
        <div
          className={`${colors[color]} ${heights[height]} rounded-full transition-all duration-700 ease-out ${animated ? 'animate-progress-fill' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
