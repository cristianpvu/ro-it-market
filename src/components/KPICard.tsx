import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  explanation?: string; // Justificare academică
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'blue',
  explanation,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className="mt-3 flex items-center gap-1">
              {getTrendIcon()}
              <span className={clsx(
                'text-sm font-medium',
                trend === 'up' && 'text-green-600',
                trend === 'down' && 'text-red-600',
                trend === 'neutral' && 'text-gray-600'
              )}>
                {trendValue}
              </span>
            </div>
          )}
          {explanation && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600 leading-relaxed">
                💡 {explanation}
              </p>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx(
            'p-3 rounded-lg border-2',
            colorClasses[color]
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
