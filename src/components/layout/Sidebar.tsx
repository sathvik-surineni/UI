/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import {
  LayoutDashboard,
  FolderKanban,
  FileCode,
  FileCheck2,
  ShoppingBag,
  KeyRound,
  ShieldAlert,
  Users2,
  Activity,
  History,
  FileCode2,
  FolderGit2,
  Cpu,
  ChevronRight,
  Database,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    activeNav,
    setActiveNav,
    projects,
    currentParticipant,
    setIsSmusBridgeOpen,
  } = useDap();

  // Active projects count
  const myProjectsCount = projects.filter((p) => p.participantId === currentParticipant?.id).length || projects.length;

  return (
    <aside className="w-64 border-r border-slate-200/90 bg-white flex flex-col shrink-0 select-none shadow-xs">
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* ================= PARTICIPANT / PRODUCER NAVIGATION ================= */}
        {(currentRole === 'PRODUCER' || currentRole === 'CONSUMER') && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Participant Workspace
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                Dual Role
              </span>
            </div>

            <nav className="space-y-1">
              {/* Participant Dashboard */}
              <button
                onClick={() => setActiveNav('producer-overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'producer-overview' || activeNav === 'participant-overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Participant Dashboard</span>
              </button>

              {/* Projects Directory */}
              <button
                onClick={() => setActiveNav('producer-projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'producer-projects'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Projects Directory</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    activeNav === 'producer-projects'
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {projects.length}
                </span>
              </button>

              {/* Project Workspace (Active project selected inside workspace) */}
              <button
                onClick={() => setActiveNav('producer-workspace')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'producer-workspace'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Database className="w-4 h-4 shrink-0" />
                  <span className="truncate">Project Workspace</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>

              {/* Contract Generator */}
              <button
                onClick={() => setActiveNav('producer-contact-generator')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'producer-contact-generator' || activeNav === 'contract-generator'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span>Contract Generator</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  S3 Schema
                </span>
              </button>
            </nav>

            {/* Consumer & Marketplace Sub-section inside Participant */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Data Marketplace & Leases
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveNav('consumer-marketplace')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeNav === 'consumer-marketplace'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Data Marketplace</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      activeNav === 'consumer-marketplace'
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    Catalog
                  </span>
                </button>

                <button
                  onClick={() => setActiveNav('consumer-subscriptions')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeNav === 'consumer-subscriptions'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span>My Subscriptions</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* ================= DAP PLATFORM ADMIN NAVIGATION ================= */}
        {currentRole === 'ADMIN' && (
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Platform Administration
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveNav('admin-overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => setActiveNav('admin-participants')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-participants'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users2 className="w-4 h-4 shrink-0" />
                  <span>Participant Tenants</span>
                </div>
              </button>

              <button
                onClick={() => setActiveNav('admin-projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-projects'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 shrink-0" />
                  <span>Global Projects</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{projects.length}</span>
              </button>

              <button
                onClick={() => setActiveNav('admin-access')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-access'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Project Admin Access</span>
              </button>

              <button
                onClick={() => setActiveNav('admin-executions')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-executions'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                <span>Global Executions</span>
              </button>

              <button
                onClick={() => setActiveNav('admin-members')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-members'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Users2 className="w-4 h-4 shrink-0" />
                <span>Platform Members</span>
              </button>

              <button
                onClick={() => setActiveNav('admin-audit')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeNav === 'admin-audit'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <FileCode2 className="w-4 h-4 shrink-0" />
                <span>Audit & Activity Log</span>
              </button>
            </nav>
          </div>
        )}

        {/* SMUS Integration Info Card */}
        <div className="pt-2">
          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white shadow-2xs">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold mb-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              SMUS Bridge Online
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              SageMaker Unified Studio lakehouse mesh connected. S3 catalog schema listener active.
            </p>
            <button
              onClick={() => setIsSmusBridgeOpen(true)}
              className="w-full text-center py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              Inspect SMUS Mesh
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="font-semibold text-slate-600">SMUS-DAP Enterprise</span>
        <span className="font-mono text-slate-500">us-east-1</span>
      </div>
    </aside>
  );
};
