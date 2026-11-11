/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { StatusBadge } from '../../common/StatusBadge';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Cpu,
  Clock,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

export const TabProjectSync: React.FC = () => {
  const {
    projects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    startProjectSync,
    isSyncRunning,
    syncProgress,
    syncCurrentStage,
  } = useDap();

  const [syncMode, setSyncMode] = useState<'Full' | 'Delta' | 'MetadataOnly'>('Full');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[Catalog Bridge] Ready. Awaiting sync trigger.',
  ]);

  if (!selectedProject) return null;

  const handleStartSync = async () => {
    if (isSyncRunning) return;
    setSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Triggering ${syncMode} synchronization on ${selectedProject.name}...`,
      ...prev,
    ]);

    await startProjectSync(selectedProject.id, syncMode);

    setSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Synchronization verified. Zero schema drift detected across all assets.`,
      `[${new Date().toLocaleTimeString()}] Updated Lake Formation access control matrix.`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Selection Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Project Catalog Synchronization
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reconciles local schemas, partition manifests, and data sharing tokens with SMUS
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Select Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Snapshot Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Participant Tenant</span>
            <span className="font-medium text-slate-900">{selectedProject.participantName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Data Assets</span>
            <span className="font-mono font-semibold text-slate-900">
              {selectedProject.assets.length} tables / streams
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Successful Sync</span>
            <span className="font-mono text-slate-700">{selectedProject.lastSyncedAt}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Execution Status</span>
            <div className="mt-0.5">
              <StatusBadge status={selectedProject.lastSyncStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* Sync Mode Selection */}
        <div className="py-4 space-y-3">
          <label className="text-xs font-semibold text-slate-900 block">
            Choose Synchronization Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <label
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                syncMode === 'Full'
                  ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="syncMode"
                checked={syncMode === 'Full'}
                onChange={() => setSyncMode('Full')}
                className="mt-0.5"
              />
              <div>
                <div className="font-semibold text-slate-900">Full Catalog & Manifest Sync</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Re-indexes all Iceberg snapshots, Redshift table schemas, and updates Lake Formation.
                </div>
              </div>
            </label>

            <label
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                syncMode === 'Delta'
                  ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="syncMode"
                checked={syncMode === 'Delta'}
                onChange={() => setSyncMode('Delta')}
                className="mt-0.5"
              />
              <div>
                <div className="font-semibold text-slate-900">Delta Incremental Partitions</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Synchronizes newly appended partitions added in the last 24-hour cycle.
                </div>
              </div>
            </label>

            <label
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                syncMode === 'MetadataOnly'
                  ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="syncMode"
                checked={syncMode === 'MetadataOnly'}
                onChange={() => setSyncMode('MetadataOnly')}
                className="mt-0.5"
              />
              <div>
                <div className="font-semibold text-slate-900">Metadata & Access Rules Only</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Pushes column masking rules and subscription authorization leases without rescanning data.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Sync Trigger Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            Cluster: <span className="font-mono text-slate-800">smus-cls-fin-prod-01</span>
          </div>

          <button
            onClick={handleStartSync}
            disabled={isSyncRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
              isSyncRunning
                ? 'bg-amber-600 cursor-not-allowed opacity-80'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncRunning ? 'animate-spin' : ''}`} />
            {isSyncRunning ? 'Executing Catalog Sync...' : 'Start Project Sync'}
          </button>
        </div>
      </div>

      {/* Live Synchronization Progress & Execution State */}
      {(isSyncRunning || syncProgress > 0) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">Synchronization Pipeline</h4>
              <span className="text-[11px] font-mono text-slate-500">
                {isSyncRunning ? 'IN_PROGRESS' : 'FINISHED'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{syncProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                syncProgress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
              style={{ width: `${syncProgress}%` }}
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-700">
            {isSyncRunning ? (
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-mono text-xs">{syncCurrentStage}</span>
          </div>
        </div>
      )}

      {/* Execution Console Logs */}
      <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs border border-slate-800 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            SMUS LAKEHOUSE CATALOG SYNC STREAM
          </span>
          <span>Buffer: Live</span>
        </div>
        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto text-[11px]">
          {syncLogs.map((log, i) => (
            <div key={i} className="text-slate-300 leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
