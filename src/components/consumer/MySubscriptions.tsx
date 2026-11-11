/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import { SubscriptionRequest } from '../../types/dap';
import {
  KeyRound,
  Database,
  Building2,
  CheckCircle2,
  Clock,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const MySubscriptions: React.FC = () => {
  const { projects, setActiveNav, navigateToMarketplaceDiscovery } = useDap();
  const [selectedSub, setSelectedSub] = useState<SubscriptionRequest | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // All subscriptions across projects that belong to the current consumer
  const allSubscriptions = projects.flatMap((p) =>
    p.subscriptions.map((s) => ({
      ...s,
      project: p,
    }))
  );

  const approvedSubs = allSubscriptions.filter((s) => s.status === 'Approved');
  const pendingSubs = allSubscriptions.filter((s) => s.status === 'Pending');

  const getQuerySnippet = (sub: SubscriptionRequest) => {
    return `# SageMaker Unified Studio Notebook / Athena SQL Client
from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("DAP-Lakehouse-Consumer") \\
    .config("spark.sql.catalog.dap", "org.apache.iceberg.spark.SparkCatalog") \\
    .config("spark.sql.catalog.dap.warehouse", "s3://smus-dap-shared-lakehouse/") \\
    .config("spark.sql.catalog.dap.uri", "${sub.connectionEndpoint || 'thrift://lakehouse.dap.internal:9083'}") \\
    .getOrCreate()

# Query approved table partition
df = spark.read.table("dap.${sub.projectId.replace(/-/g, '_')}.${sub.requestedAssets[0] || 'dataset'}")
df.filter("event_date >= current_date() - 7").show(10)`;
  };

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Discovery Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Data Subscriptions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active data leases, pending approvals, and connection endpoints granted to your participant
          </p>
        </div>

        <button
          onClick={() => setActiveNav('consumer-marketplace')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          Explore Marketplace
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Approved Active Leases
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {approvedSubs.length}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Live Lake Formation connections</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Pending Approval Requests
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {pendingSubs.length}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Under review by data stewards</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Subscriptions Tracked
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {allSubscriptions.length}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Historical & active requests</span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Subscription Access Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Project & Code</th>
                <th className="py-2.5 px-3">Producer Participant</th>
                <th className="py-2.5 px-3">Included Assets</th>
                <th className="py-2.5 px-3">SLA Tier</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Request Date</th>
                <th className="py-2.5 px-4 text-right">Connection & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No subscriptions found. Browse the Data Marketplace to request access.
                  </td>
                </tr>
              ) : (
                allSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigateToMarketplaceDiscovery(sub.projectId)}
                        className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline block truncate max-w-xs"
                      >
                        {sub.projectName}
                      </button>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {sub.project.code}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-800">{sub.project.participantName}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-800">
                        {sub.requestedAssets.length} asset(s)
                      </span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {sub.requestedAssets.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{sub.slaTier}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {sub.requestDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors"
                      >
                        {sub.status === 'Approved' ? 'Connection Credentials' : 'View Status'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credentials & Details Drawer */}
      <Drawer
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={selectedSub ? `Subscription Details: ${selectedSub.projectName}` : 'Subscription'}
        subtitle={selectedSub ? `Status: ${selectedSub.status} · SLA: ${selectedSub.slaTier}` : ''}
        width="xl"
        footer={
          <button
            onClick={() => setSelectedSub(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
          >
            Close Details
          </button>
        }
      >
        {selectedSub && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Status Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  Approval Posture
                </span>
                <span className="font-semibold text-slate-900 text-sm">{selectedSub.status}</span>
                {selectedSub.decidedAt && (
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Decided: {selectedSub.decidedAt} by {selectedSub.decidedBy}
                  </div>
                )}
              </div>
              <StatusBadge status={selectedSub.status} size="md" />
            </div>

            {/* Connection URI if approved */}
            {selectedSub.status === 'Approved' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Lakehouse Read Endpoint Active
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-[11px] text-slate-800 break-all select-all">
                    {selectedSub.connectionEndpoint ||
                      'lakehouse.dap.smus.aws.internal:8443/catalog/share_v1'}
                  </div>
                </div>

                {/* Notebook / PySpark Snippet */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      PySpark / SMUS Notebook Connection Snippet
                    </span>
                    <button
                      onClick={() => handleCopySnippet(getQuerySnippet(selectedSub))}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      {copiedSnippet ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedSnippet ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800 whitespace-pre">
                    {getQuerySnippet(selectedSub)}
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Note if rejected */}
            {selectedSub.status === 'Rejected' && selectedSub.rejectionReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                <span className="font-semibold block mb-1">Reason for Rejection:</span>
                <p className="text-xs">{selectedSub.rejectionReason}</p>
              </div>
            )}

            {/* Justification Provided */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">
                Your Submitted Business Justification
              </span>
              <p className="text-slate-700 italic">"{selectedSub.justification}"</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
