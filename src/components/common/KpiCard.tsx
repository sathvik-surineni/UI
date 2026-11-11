/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  isActive?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-lg p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''
      } ${isActive ? 'border-slate-800 ring-1 ring-slate-800' : 'border-slate-200 shadow-2xs'}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{sublabel}</p>
      )}
    </div>
  );
};
