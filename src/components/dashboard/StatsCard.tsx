import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  children?: ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  children
}) => {
  const changeColorClasses = {
    positive: 'text-emerald-600 bg-emerald-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-slate-600 bg-slate-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        {change && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${changeColorClasses[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
      {children}
    </div>
  );
};