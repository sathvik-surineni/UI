/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../../context/DapContext';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';
import { DataAsset, SubscriptionRequest } from '../../../types/dap';
import {
  Database,
  Users2,
  Clock,
  Filter,
  RefreshCw,
  FileText,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Activity,
} from 'lucide-react';

export const TabOverview: React.FC = () => {
  const { selectedProject, setProjectActiveTab, setActiveNav, startProjectSync, isSyncRunning } = useDap();

  if (!selectedProject) return null;

  const totalAssets = selectedProject.assets.length;
  const approvedSubs = selectedProject.subscriptions.filter((s: SubscriptionRequest) => s.status === 'Approved').length;
  const pendingSubs = selectedProject.subscriptions.filter((s: SubscriptionRequest) => s.status === 'Pending').length;
  const totalFilters = selectedProject.filters.length;
  const totalMembers = selectedProject.members.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard
          label="Total Data Assets"
          value={totalAssets}
          sublabel="Lakehouse & Redshift tables"
          icon={Database}
          onClick={() => setProjectActiveTab('assets')}
        />
        <KpiCard
          label="Active Subscribers"
          value={approvedSubs}
          sublabel="Approved participant leases"
          icon={Users2}
          onClick={() => setProjectActiveTab('subscriptions')}
        />
        <KpiCard
          label="Pending Requests"
          value={pendingSubs}
          sublabel={pendingSubs > 0 ? 'Requires your approval' : 'All requests processed'}
          icon={Clock}
          trend={pendingSubs > 0 ? { value: `${pendingSubs} awaiting review` } : undefined}
          onClick={() => setProjectActiveTab('subscriptions')}
        />
        <KpiCard
          label="Governance Filters"
          value={totalFilters}
          sublabel="Row & column masking rules"
          icon={Filter}
          onClick={() => setProjectActiveTab('filters')}
        />
        <KpiCard
          label="Project Members"
          value={totalMembers}
          sublabel="Admins, editors & viewers"
          icon={UserPlus}
          onClick={() => setProjectActiveTab('members')}
        />
      </div>

      {/* Quick Action Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              SMUS Lakehouse Mesh
            </span>
            <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
              Live Gateway
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {selectedProject.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl line-clamp-2">
            {selectedProject.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setProjectActiveTab('sync')}
            disabled={isSyncRunning}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncRunning ? 'animate-spin' : ''}`} />
            {isSyncRunning ? 'Syncing...' : 'Sync Project'}
          </button>
          <button
            onClick={() => setActiveNav('producer-contact-generator')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Contract
          </button>
        </div>
      </div>

      {/* 2-Column Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Asset & Storage Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage & Asset Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Registered Data Assets</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published storage formats federated through SageMaker Unified Studio
                </p>
              </div>
              <button
                onClick={() => setProjectActiveTab('assets')}
                className="text-xs font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                View all ({totalAssets}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedProject.assets.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                No data assets added to this project yet.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProject.assets.map((asset: DataAsset) => (
                  <div
                    key={asset.id}
                    className="p-3 border border-slate-100 bg-slate-50/50 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 font-mono truncate">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{asset.type}</span>
                          <span>·</span>
                          <span className="font-mono">{asset.rowCount} rows</span>
                          <span>·</span>
                          <span className="font-mono">{asset.sizeBytes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={asset.sharingStatus} size="sm" />
                      <button
                        onClick={() => setProjectActiveTab('assets')}
                        className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Subscriptions Review Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Recent Subscription Inquiries</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subscribers requesting cross-participant Lake Formation credentials
                </p>
              </div>
              <button
                onClick={() => setProjectActiveTab('subscriptions')}
                className="text-xs font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                Manage ({selectedProject.subscriptions.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedProject.subscriptions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                No subscription requests received yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                {selectedProject.subscriptions.slice(0, 3).map((sub: SubscriptionRequest) => (
                  <div key={sub.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {sub.subscriberName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sub.subscriberOrg} · {sub.slaTier}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                        "{sub.justification}"
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} size="sm" />
                      <button
                        onClick={() => setProjectActiveTab('subscriptions')}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Execution Health & Contact Lead */}
        <div className="space-y-6">
          {/* Synchronization Health */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Catalog Synchronization
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Last Synced</span>
                <span className="font-mono text-slate-800 font-medium">{selectedProject.lastSyncedAt}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sync Status</span>
                <StatusBadge status={selectedProject.lastSyncStatus} size="sm" />
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">SMUS Workspace</span>
                <span className="font-mono text-slate-800 text-[11px] truncate max-w-[150px]">
                  {selectedProject.smusWorkspace}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Classification</span>
                <span className="font-medium text-slate-800">{selectedProject.sensitivity}</span>
              </div>
            </div>

            <button
              onClick={() => setProjectActiveTab('sync')}
              className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              Configure Sync Settings
            </button>
          </div>

          {/* Contact Steward Info Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900">Project Data Steward</h4>
              <button
                onClick={() => setActiveNav('producer-contact-generator')}
                className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
              >
                Regenerate
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="font-semibold text-slate-900">
                  {selectedProject.contactInfo.dataStewardName}
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  {selectedProject.contactInfo.dataStewardEmail}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400">Technical Lead:</span>{' '}
                  {selectedProject.contactInfo.technicalLead}
                </div>
                <div>
                  <span className="text-slate-400">Slack:</span>{' '}
                  <span className="font-mono">{selectedProject.contactInfo.slackChannel}</span>
                </div>
                <div>
                  <span className="text-slate-400">SLA:</span> {selectedProject.contactInfo.supportSla}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
