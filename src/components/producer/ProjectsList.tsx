/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { CreateProjectModal } from './CreateProjectModal';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  Database,
  Users2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ProjectsList: React.FC = () => {
  const { projects, navigateToProjectWorkspace, currentParticipant } = useDap();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'All' || p.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const domains = ['All', ...new Set(projects.map((p) => p.domain))];

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and manage all data sharing projects registered across active participant clusters
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, code, or description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-slate-800"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
                <tr>
                  <th className="py-2.5 px-4">Project Name & Code</th>
                  <th className="py-2.5 px-3">Participant Tenant</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Data Assets</th>
                  <th className="py-2.5 px-3">Subscribers</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Synced</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigateToProjectWorkspace(project.id, 'overview')}
                        className="font-semibold text-slate-900 text-left hover:text-indigo-600 hover:underline block truncate max-w-xs"
                      >
                        {project.name}
                      </button>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {project.code}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-800">{project.participantName}</td>
                    <td className="py-3 px-3 text-slate-600">{project.domain}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-900">
                      {project.assets.length}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800">
                      {project.subscriptions.filter((s) => s.status === 'Approved').length}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={project.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {project.lastSyncedAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToProjectWorkspace(project.id, 'overview')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                        >
                          Workspace
                        </button>
                        <button
                          onClick={() => navigateToProjectWorkspace(project.id, 'members')}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200"
                        >
                          Members
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {project.code}
                  </span>
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <h3
                  onClick={() => navigateToProjectWorkspace(project.id, 'overview')}
                  className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer line-clamp-1"
                >
                  {project.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Data Assets</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {project.assets.length} tables
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Subscribers</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {project.subscriptions.filter((s) => s.status === 'Approved').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {project.participantName}
                </span>
                <button
                  onClick={() => navigateToProjectWorkspace(project.id, 'overview')}
                  className="text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1"
                >
                  Open Workspace <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(id) => navigateToProjectWorkspace(id, 'overview')}
      />
    </div>
  );
};
