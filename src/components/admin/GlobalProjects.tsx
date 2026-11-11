/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FolderGit2,
  Search,
  Building2,
  ShieldCheck,
  ExternalLink,
  History,
  HardDrive,
  Users2,
  Filter,
} from 'lucide-react';

export const GlobalProjects: React.FC = () => {
  const {
    projects,
    participants,
    navigateToProjectWorkspace,
    setActiveNav,
  } = useDap();

  const [search, setSearch] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.participantName.toLowerCase().includes(search.toLowerCase());

    const matchesPart =
      selectedParticipantId === 'All' || p.participantId === selectedParticipantId;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesPart && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Centralized Global Project Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master directory of all federated data projects across all participant clusters
          </p>
        </div>

        <button
          onClick={() => setActiveNav('admin-access')}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          Assign Project Admin Access
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all projects by name, code, participant, or owner..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Participant:</span>
            <select
              value={selectedParticipantId}
              onChange={(e) => setSelectedParticipantId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-slate-800"
            >
              <option value="All">All Participants</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global Projects Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Project Name & Code</th>
                <th className="py-2.5 px-3">Participant Tenant</th>
                <th className="py-2.5 px-3">Project Owner</th>
                <th className="py-2.5 px-3">Assets</th>
                <th className="py-2.5 px-3">Subscribers</th>
                <th className="py-2.5 px-3">Last Sync</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                      className="font-semibold text-slate-900 text-left hover:text-indigo-600 hover:underline block truncate max-w-xs"
                    >
                      {proj.name}
                    </button>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {proj.code} · {proj.id}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{proj.participantName}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <div>{proj.ownerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{proj.ownerEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">
                    {proj.assets.length}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    {proj.subscriptions.filter((s) => s.status === 'Approved').length}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {proj.lastSyncedAt}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={proj.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setActiveNav('admin-access')}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded"
                        title="Assign Project Admin"
                      >
                        Admin Access
                      </button>
                    </div>
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
