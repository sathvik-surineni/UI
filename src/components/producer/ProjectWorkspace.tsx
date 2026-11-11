/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { CreateProjectModal } from './CreateProjectModal';
import { TabOverview } from './workspace/TabOverview';
import { TabDataAssets } from './workspace/TabDataAssets';
import { TabSchemaMetadata } from './workspace/TabSchemaMetadata';
import { TabFilters } from './workspace/TabFilters';
import { TabSubscriptions } from './workspace/TabSubscriptions';
import { TabProjectSync } from './workspace/TabProjectSync';
import { TabExecutionHistory } from './workspace/TabExecutionHistory';
import { TabMembers } from './workspace/TabMembers';
import { TabSettings } from './workspace/TabSettings';
import {
  LayoutDashboard,
  HardDrive,
  Code2,
  Filter,
  Users2,
  RefreshCw,
  History,
  UserPlus,
  Sliders,
  ExternalLink,
  Building2,
  Shield,
  FileText,
  FolderKanban,
  Plus,
  ChevronDown,
} from 'lucide-react';

export const ProjectWorkspace: React.FC = () => {
  const {
    projects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    projectActiveTab,
    setProjectActiveTab,
    setActiveNav,
    startProjectSync,
    isSyncRunning,
  } = useDap();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!selectedProject) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        No project selected. Please select a project from the projects directory.
      </div>
    );
  }

  const tabs: { id: string; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'assets', label: 'Data Assets', icon: HardDrive, count: selectedProject.assets.length },
    { id: 'schema', label: 'Schema & Metadata', icon: Code2, count: selectedProject.schemas.length },
    { id: 'filters', label: 'Filters', icon: Filter, count: selectedProject.filters.length },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: Users2,
      count: selectedProject.subscriptions.length,
    },
    { id: 'sync', label: 'Project Sync', icon: RefreshCw },
    {
      id: 'executions',
      label: 'Execution History',
      icon: History,
      count: selectedProject.executions.length,
    },
    { id: 'members', label: 'Members', icon: UserPlus, count: selectedProject.members.length },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Wayfarer Aesthetic Project Switcher Bar */}
      <div className="enterprise-card p-3.5 bg-gradient-to-r from-white via-slate-50 to-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 text-white shadow-2xs">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Project Workspace
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="font-bold text-sm text-slate-900 bg-white border border-slate-300 rounded-lg py-1 pl-2.5 pr-8 focus:outline-hidden focus:ring-2 focus:ring-slate-900 shadow-2xs cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            New Project
          </button>
        </div>
      </div>

      {/* Project Workspace Header Card */}
      <div className="enterprise-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {selectedProject.code}
              </span>
              <StatusBadge status={selectedProject.status} size="sm" />
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {selectedProject.participantName}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {selectedProject.domain}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setProjectActiveTab('sync')}
              disabled={isSyncRunning}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncRunning ? 'animate-spin' : ''}`} />
              {isSyncRunning ? 'Syncing...' : 'Sync Catalog'}
            </button>

            <button
              onClick={() => setActiveNav('producer-contact-generator')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Contract Spec
            </button>

            <button
              onClick={() => setProjectActiveTab('members')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Users2 className="w-3.5 h-3.5 text-slate-500" />
              Members
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="border-t border-slate-100 pt-3 flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = projectActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProjectActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {projectActiveTab === 'overview' && <TabOverview />}
        {projectActiveTab === 'assets' && <TabDataAssets />}
        {projectActiveTab === 'schema' && <TabSchemaMetadata />}
        {projectActiveTab === 'filters' && <TabFilters />}
        {projectActiveTab === 'subscriptions' && <TabSubscriptions />}
        {projectActiveTab === 'sync' && <TabProjectSync />}
        {projectActiveTab === 'executions' && <TabExecutionHistory />}
        {projectActiveTab === 'members' && <TabMembers />}
        {projectActiveTab === 'settings' && <TabSettings />}
      </div>

      {/* New Project Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(id) => {
          setSelectedProjectId(id);
          setProjectActiveTab('overview');
        }}
      />
    </div>
  );
};
