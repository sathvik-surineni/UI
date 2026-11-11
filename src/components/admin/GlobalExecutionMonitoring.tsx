/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import { ExecutionRecord } from '../../types/dap';
import {
  History,
  Search,
  Filter,
  Terminal,
  Activity,
  AlertTriangle,
  RotateCw,
  Clock,
  Building2,
} from 'lucide-react';

export const GlobalExecutionMonitoring: React.FC = () => {
  const { projects, participants } = useDap();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [participantFilter, setParticipantFilter] = useState('All');
  const [selectedExec, setSelectedExec] = useState<ExecutionRecord | null>(null);

  // Cross platform executions
  const allExecutions = projects.flatMap((p) => p.executions);

  const filtered = allExecutions.filter((exec) => {
    const matchesSearch =
      !search ||
      exec.id.toLowerCase().includes(search.toLowerCase()) ||
      exec.projectName.toLowerCase().includes(search.toLowerCase()) ||
      exec.triggeredBy.toLowerCase().includes(search.toLowerCase()) ||
      exec.type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || exec.status === statusFilter;
    const matchesPart =
      participantFilter === 'All' || exec.participantName === participantFilter;

    return matchesSearch && matchesStatus && matchesPart;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Global Execution Monitoring
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor catalog synchronization jobs, Lake Formation grant updates, and schema validation runs across all clusters
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search executions by ID, project, trigger, or type..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Participant:</span>
            <select
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-slate-800"
            >
              <option value="All">All Participants</option>
              {participants.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Running">Running</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Execution ID & Type</th>
                <th className="py-2.5 px-3">Participant Tenant</th>
                <th className="py-2.5 px-3">Target Project</th>
                <th className="py-2.5 px-3">Triggered By</th>
                <th className="py-2.5 px-3">Started At</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No execution records match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((exec) => (
                  <tr key={exec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900">{exec.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{exec.type}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-800">{exec.participantName}</td>
                    <td className="py-3 px-3 font-medium text-slate-900 truncate max-w-[200px]">
                      {exec.projectName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{exec.triggeredBy}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {exec.startedAt}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800">{exec.duration}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={exec.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedExec(exec)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors"
                      >
                        Inspect Logs
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Inspector Drawer */}
      <Drawer
        isOpen={!!selectedExec}
        onClose={() => setSelectedExec(null)}
        title={selectedExec ? `Global Execution ${selectedExec.id}` : 'Execution Run'}
        subtitle={selectedExec ? `${selectedExec.participantName} · ${selectedExec.projectName}` : ''}
        width="xl"
        footer={
          <button
            onClick={() => setSelectedExec(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
          >
            Close Inspector
          </button>
        }
      >
        {selectedExec && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Trigger:</span>{' '}
                <span className="font-semibold text-slate-900">{selectedExec.triggeredBy}</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>{' '}
                <span className="font-semibold text-slate-900">{selectedExec.status}</span>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>{' '}
                <span className="font-mono text-slate-900">{selectedExec.duration}</span>
              </div>
              <div>
                <span className="text-slate-400">Completed:</span>{' '}
                <span className="font-mono text-slate-700">{selectedExec.completedAt}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Raw Execution Step Logs
              </h4>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-[11px] space-y-1.5 max-h-80 overflow-y-auto border border-slate-800 select-all">
                {selectedExec.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
