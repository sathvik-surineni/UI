/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileCode2,
  Search,
  Download,
  Filter,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, showToast } = useDap();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.participant.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Actor Email', 'Action', 'Target', 'Participant', 'Severity', 'IP Address', 'Details'];
    const rows = filtered.map((log) => [
      log.id,
      log.timestamp,
      `"${log.actor}"`,
      log.actorEmail,
      log.action,
      `"${log.target}"`,
      `"${log.participant}"`,
      log.severity,
      log.ipAddress,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dap_compliance_audit_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Audit Report Exported', 'Downloaded compliance CSV report.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Administrative Audit & Activity Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable compliance record for data sharing contracts, Lake Formation leases, and delegation operations
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Audit Ledger (CSV)
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
            placeholder="Search by action, actor, target resource, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Severity:</span>
          {['All', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor & Participant</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Resource</th>
                <th className="py-2.5 px-4">Details & Event Context</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {log.participant}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-[11px] text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 max-w-[180px] truncate">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 text-right">
                    {log.ipAddress}
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
