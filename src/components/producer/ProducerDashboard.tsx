/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { CreateProjectModal } from './CreateProjectModal';
import {
  FolderKanban,
  HardDrive,
  Users2,
  Clock,
  Filter,
  History,
  Plus,
  RefreshCw,
  FileText,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const ProducerDashboard: React.FC = () => {
  const {
    projects,
    currentParticipant,
    navigateToProjectWorkspace,
    setActiveNav,
    setProjectActiveTab,
  } = useDap();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Producer specific metrics
  const totalProjects = projects.length;
  const totalAssets = projects.reduce((acc, p) => acc + p.assets.length, 0);
  const totalActiveSubs = projects.reduce(
    (acc, p) => acc + p.subscriptions.filter((s) => s.status === 'Approved').length,
    0
  );
  const pendingRequests = projects.flatMap((p) =>
    p.subscriptions.filter((s) => s.status === 'Pending').map((s) => ({ ...s, project: p }))
  );
  const totalFilters = projects.reduce((acc, p) => acc + p.filters.length, 0);
  const recentExecutions = projects.flatMap((p) => p.executions).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Producer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Governance console for publishing data assets, managing participant subscriptions, and catalog reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
          <button
            onClick={() => setActiveNav('producer-contact-generator')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Contact Generator
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <KpiCard
          label="Total Projects"
          value={totalProjects}
          sublabel="Owned & Co-owned"
          icon={FolderKanban}
          onClick={() => setActiveNav('producer-projects')}
        />
        <KpiCard
          label="Total Data Assets"
          value={totalAssets}
          sublabel="Iceberg, S3 & Redshift"
          icon={HardDrive}
        />
        <KpiCard
          label="Active Subscriptions"
          value={totalActiveSubs}
          sublabel="Lakehouse access leases"
          icon={Users2}
        />
        <KpiCard
          label="Pending Requests"
          value={pendingRequests.length}
          sublabel={pendingRequests.length > 0 ? 'Requires decision' : 'All clear'}
          icon={Clock}
          trend={pendingRequests.length > 0 ? { value: `${pendingRequests.length} action items` } : undefined}
          isActive={pendingRequests.length > 0}
        />
        <KpiCard
          label="Governance Filters"
          value={totalFilters}
          sublabel="Column & row rules"
          icon={Filter}
        />
        <KpiCard
          label="Recent Executions"
          value={recentExecutions.length}
          sublabel="Catalog sync & updates"
          icon={History}
        />
      </div>

      {/* Projects Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Projects Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status and synchronization posture of published DAP data projects
            </p>
          </div>
          <button
            onClick={() => setActiveNav('producer-projects')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
          >
            View all projects ({totalProjects}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Project Name</th>
                <th className="py-2.5 px-3">Project ID</th>
                <th className="py-2.5 px-3">Assets</th>
                <th className="py-2.5 px-3">Subscribers</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Synced</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                      className="font-semibold text-slate-900 text-left hover:text-indigo-600 hover:underline block truncate max-w-xs"
                    >
                      {proj.name}
                    </button>
                    <div className="text-[11px] text-slate-500">{proj.domain}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{proj.id}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">
                    {proj.assets.length}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    {proj.subscriptions.filter((s) => s.status === 'Approved').length}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={proj.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {proj.lastSyncedAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      Open Workspace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Split: Pending Subscriptions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Subscription Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Participants requesting access to your data schemas
              </p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-lg">
              No pending requests awaiting approval.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {req.subscriberName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.subscriberOrg} · {req.project.name}
                      </div>
                    </div>
                    <StatusBadge status="Pending" size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 italic">"{req.justification}"</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">{req.requestDate}</span>
                    <button
                      onClick={() => navigateToProjectWorkspace(req.projectId, 'subscriptions')}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Review & Approve →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Executions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Execution Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Catalog synchronization and governance propagation runs
              </p>
            </div>
          </div>

          {recentExecutions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-lg">
              No recent executions.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              {recentExecutions.map((exec) => (
                <div key={exec.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 font-mono flex items-center gap-2">
                      <span>{exec.id}</span>
                      <span className="font-normal font-sans text-slate-600">· {exec.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Triggered by {exec.triggeredBy} · {exec.duration}
                    </div>
                  </div>
                  <StatusBadge status={exec.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(id) => navigateToProjectWorkspace(id, 'overview')}
      />
    </div>
  );
};
