/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status?.toLowerCase() || '';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (norm.includes('active') || norm.includes('success') || norm.includes('approved') || norm.includes('shared')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (norm.includes('pending') || norm.includes('running') || norm.includes('in_progress') || norm.includes('syncing')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (norm.includes('failed') || norm.includes('rejected') || norm.includes('revoked') || norm.includes('restricted')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (norm.includes('draft') || norm.includes('never') || norm.includes('drift') || norm.includes('internal')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (norm.includes('restricted') || norm.includes('confidential')) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${colorClasses} ${padding} whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};
