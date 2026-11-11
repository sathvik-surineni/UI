/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users2,
  FolderGit2,
  Activity,
  HardDrive,
  KeyRound,
  Clock,
  History,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    participants,
    projects,
    platformUsers,
    auditLogs,
    setActiveNav,
    navigateToProjectWorkspace,
  } = useDap();

  const totalParticipants = participants.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Active').length;
  const totalPlatformUsers = platformUsers.length;
  const totalDataAssets = projects.reduce((acc, p) => acc + p.assets.length, 0);
  const totalSubscriptions = projects.reduce((acc, p) => acc + p.subscriptions.length, 0);
  const pendingRequests = projects.flatMap((p) =>
    p.subscriptions.filter((s) => s.status === 'Pending')
  ).length;
  const allExecutions = projects.flatMap((p) => p.executions);
  const failedExecutions = allExecutions.filter((e) => e.status === 'Failed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              DAP Platform Administration Console
            </h1>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              SUPERADMIN PRIVILEGES
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized telemetry, cross-participant governance, Lake Formation mesh coordination, and execution oversight
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveNav('admin-access')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Assign Project Admin
          </button>
          <button
            onClick={() => setActiveNav('admin-audit')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Participants"
          value={totalParticipants}
          sublabel="Enterprise tenants registered"
          icon={Building2}
          onClick={() => setActiveNav('admin-participants')}
        />
        <KpiCard
          label="Global Projects"
          value={totalProjects}
          sublabel={`${activeProjects} active across all nodes`}
          icon={FolderGit2}
          onClick={() => setActiveNav('admin-projects')}
        />
        <KpiCard
          label="Platform Users"
          value={totalPlatformUsers}
          sublabel="Data architects & engineers"
          icon={Users2}
          onClick={() => setActiveNav('admin-members')}
        />
        <KpiCard
          label="Total Data Assets"
          value={totalDataAssets}
          sublabel="Iceberg & Redshift tables"
          icon={HardDrive}
        />
        <KpiCard
          label="Total Subscriptions"
          value={totalSubscriptions}
          sublabel="Cross-account grants"
          icon={KeyRound}
        />
        <KpiCard
          label="Pending Approvals"
          value={pendingRequests}
          sublabel={pendingRequests > 0 ? 'Lease requests pending' : 'Zero backlog'}
          icon={Clock}
        />
        <KpiCard
          label="Total Executions"
          value={allExecutions.length + 8}
          sublabel="Sync & grant propagation"
          icon={History}
          onClick={() => setActiveNav('admin-executions')}
        />
        <KpiCard
          label="Failed Executions"
          value={failedExecutions.length}
          sublabel="System health alert triage"
          icon={AlertTriangle}
          trend={failedExecutions.length === 0 ? { value: '100% nominal', isPositive: true } : undefined}
          onClick={() => setActiveNav('admin-executions')}
        />
      </div>

      {/* 2-Column Split: Top Shared Projects & Participant Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shared Projects */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Highest Adoption Projects</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Projects with the highest cross-participant subscription demand
              </p>
            </div>
            <button
              onClick={() => setActiveNav('admin-projects')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
            >
              All Projects <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{proj.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {proj.participantName} · {proj.assets.length} assets
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-700 font-semibold">
                    {proj.subscriptions.filter((s) => s.status === 'Approved').length} leases
                  </span>
                  <StatusBadge status={proj.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Tenant Nodes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Connected Participant Tenants</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cluster endpoints integrated with the DAP Lake Formation hub
              </p>
            </div>
            <button
              onClick={() => setActiveNav('admin-participants')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
            >
              Manage Tenants <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {participants.map((part) => (
              <div key={part.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{part.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {part.code} · {part.region}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    {part.projectsCount} projects
                  </span>
                  <StatusBadge status={part.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Recent Audit Stream */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Platform Security & Audit Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit events written to immutable governance register
            </p>
          </div>
          <button
            onClick={() => setActiveNav('admin-audit')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Full Audit View ({auditLogs.length}) →
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Actor</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Target Resource</th>
                <th className="py-2 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{log.actor}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{log.target}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
