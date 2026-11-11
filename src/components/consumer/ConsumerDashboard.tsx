/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShoppingBag,
  KeyRound,
  Clock,
  CheckCircle2,
  Activity,
  ArrowRight,
  Database,
  Building2,
  Sparkles,
} from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const { projects, setActiveNav, navigateToMarketplaceDiscovery } = useDap();

  // Consumer aggregates
  const availableProjectsCount = projects.length;
  const allSubs = projects.flatMap((p) => p.subscriptions);
  const approvedSubs = allSubs.filter((s) => s.status === 'Approved');
  const pendingSubs = allSubs.filter((s) => s.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Consumer Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover federated data products, monitor active subscription grants, and query cross-tenant lakehouses
          </p>
        </div>

        <button
          onClick={() => setActiveNav('consumer-marketplace')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Marketplace
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Available Projects"
          value={availableProjectsCount}
          sublabel="Catalog datasets"
          icon={ShoppingBag}
          onClick={() => setActiveNav('consumer-marketplace')}
        />
        <KpiCard
          label="My Subscriptions"
          value={allSubs.length}
          sublabel="Total tracked leases"
          icon={KeyRound}
          onClick={() => setActiveNav('consumer-subscriptions')}
        />
        <KpiCard
          label="Pending Requests"
          value={pendingSubs.length}
          sublabel={pendingSubs.length > 0 ? 'Awaiting steward review' : 'No pending reviews'}
          icon={Clock}
          onClick={() => setActiveNav('consumer-subscriptions')}
        />
        <KpiCard
          label="Approved Subscriptions"
          value={approvedSubs.length}
          sublabel="Active lakehouse queries"
          icon={CheckCircle2}
          onClick={() => setActiveNav('consumer-subscriptions')}
        />
      </div>

      {/* Featured / Recently Discovered Projects */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recommended Datasets for Your Domain</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-frequency tables curated by enterprise participants
            </p>
          </div>
          <button
            onClick={() => setActiveNav('consumer-marketplace')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View all ({projects.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between bg-slate-50/50"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    {proj.code}
                  </span>
                  <StatusBadge status={proj.sensitivity} size="sm" />
                </div>
                <h3
                  onClick={() => navigateToMarketplaceDiscovery(proj.id)}
                  className="font-bold text-xs text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                >
                  {proj.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">{proj.assets.length} assets</span>
                <button
                  onClick={() => navigateToMarketplaceDiscovery(proj.id)}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Inspect →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Status Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Subscription Activity</h2>
          <button
            onClick={() => setActiveNav('consumer-subscriptions')}
            className="text-xs text-slate-600 hover:text-slate-900 underline"
          >
            Manage Subscriptions
          </button>
        </div>

        {allSubs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed rounded-lg">
            You have not requested any subscriptions yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {allSubs.slice(0, 4).map((sub) => (
              <div key={sub.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{sub.projectName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {sub.requestedAssets.join(', ')} · SLA: {sub.slaTier}
                  </div>
                </div>
                <StatusBadge status={sub.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
