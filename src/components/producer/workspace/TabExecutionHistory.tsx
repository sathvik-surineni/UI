/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Drawer } from '../../common/Drawer';
import { ExecutionRecord, ExecutionStatus } from '../../../types/dap';
import {
  History,
  Terminal,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  ExternalLink,
} from 'lucide-react';

export const TabExecutionHistory: React.FC = () => {
  const { selectedProject } = useDap();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedExec, setSelectedExec] = useState<ExecutionRecord | null>(null);

  if (!selectedProject) return null;

  const executions = selectedProject.executions.filter((exec) => {
    const matchesStatus = statusFilter === 'All' || exec.status === statusFilter;
    const matchesSearch =
      !search ||
      exec.id.toLowerCase().includes(search.toLowerCase()) ||
      exec.type.toLowerCase().includes(search.toLowerCase()) ||
      exec.triggeredBy.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Execution ID, trigger..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Successful', 'Running', 'Failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Execution ID & Type</th>
                <th className="py-2.5 px-3">Triggered By</th>
                <th className="py-2.5 px-3">Started At</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Records Processed</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No execution records match the active criteria.
                  </td>
                </tr>
              ) : (
                executions.map((exec) => (
                  <tr key={exec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900">{exec.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{exec.type}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-800">{exec.triggeredBy}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {exec.startedAt}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800">{exec.duration}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {exec.recordsProcessed || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={exec.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedExec(exec)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
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

      {/* Execution Details & Log Drawer */}
      <Drawer
        isOpen={!!selectedExec}
        onClose={() => setSelectedExec(null)}
        title={selectedExec ? `Execution Record ${selectedExec.id}` : 'Execution Run'}
        subtitle={selectedExec ? `${selectedExec.type} · ${selectedExec.status}` : ''}
        width="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400 font-mono">
              Completed: {selectedExec?.completedAt}
            </span>
            <button
              onClick={() => setSelectedExec(null)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedExec && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Metadata Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Triggered By:</span>{' '}
                <span className="font-semibold text-slate-900">{selectedExec.triggeredBy}</span>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>{' '}
                <span className="font-mono font-medium text-slate-900">{selectedExec.duration}</span>
              </div>
              <div>
                <span className="text-slate-400">Started:</span>{' '}
                <span className="font-mono text-slate-700">{selectedExec.startedAt}</span>
              </div>
              <div>
                <span className="text-slate-400">Records Processed:</span>{' '}
                <span className="font-mono text-slate-700">
                  {selectedExec.recordsProcessed || 'N/A'}
                </span>
              </div>
            </div>

            {/* Error Message if Failed */}
            {selectedExec.errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                <strong>Error Details:</strong> {selectedExec.errorMessage}
              </div>
            )}

            {/* Console Log Output */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Execution Step Logs ({selectedExec.logs.length} entries)
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
