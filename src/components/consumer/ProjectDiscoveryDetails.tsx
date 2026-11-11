/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { RequestSubscriptionModal } from './RequestSubscriptionModal';
import {
  ArrowLeft,
  Building2,
  HardDrive,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  KeyRound,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const ProjectDiscoveryDetails: React.FC = () => {
  const {
    discoveryProjectId,
    projects,
    setActiveNav,
  } = useDap();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const project = projects.find((p) => p.id === discoveryProjectId) || projects[0];

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveNav('consumer-marketplace')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Data Marketplace
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {project.code}
              </span>
              <StatusBadge status={project.sensitivity} size="sm" />
              <span className="text-xs text-slate-500 font-medium">{project.domain}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {project.name}
            </h1>

            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {project.description}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Producer: <strong className="text-slate-800">{project.participantName}</strong></span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span>Cluster: {project.smusWorkspace}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Request Subscription
            </button>
            <span className="text-[11px] text-center text-slate-400">
              Requires Producer Approval
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Discovery Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Data Assets & Schema Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Assets Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Included Data Assets ({project.assets.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical lakehouse tables and feature stores available under this data share contract
              </p>
            </div>

            <div className="space-y-3">
              {project.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-semibold text-xs text-slate-900">
                        {asset.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{asset.description}</div>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {asset.type}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Row Volume</span>
                      <span className="font-mono font-medium text-slate-800">{asset.rowCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Disk Footprint</span>
                      <span className="font-mono font-medium text-slate-800">{asset.sizeBytes}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Partitions</span>
                      <span className="font-mono text-slate-700 truncate block">
                        {asset.partitions.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schemas Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Available Schemas & Column Contracts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect attributes, field types, and sensitive data tags before requesting access
              </p>
            </div>

            {project.schemas.map((schema) => (
              <div key={schema.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span className="font-mono font-semibold text-xs text-slate-900">
                      {schema.name}
                    </span>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {schema.version}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {schema.fields.length} attributes
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white border-b border-slate-100 font-medium text-slate-500">
                      <tr>
                        <th className="py-2 px-3">Field Name</th>
                        <th className="py-2 px-2">Data Type</th>
                        <th className="py-2 px-2">Nullable</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {schema.fields.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono font-medium text-slate-900 flex items-center gap-1.5">
                            {f.name}
                            {f.pii && (
                              <span className="text-[9px] font-semibold text-rose-700 bg-rose-50 px-1 py-0.2 rounded">
                                PII
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 font-mono text-indigo-700 text-[11px]">{f.type}</td>
                          <td className="py-2 px-2 text-[11px] text-slate-400">
                            {f.nullable ? 'YES' : 'NO'}
                          </td>
                          <td className="py-2 px-3 text-slate-600 max-w-xs">{f.description}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-500 truncate max-w-[130px]">
                            {f.sampleValue || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Governance Rules & Data Steward Contact */}
        <div className="space-y-6">
          {/* Data Steward Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Data Steward Contact
            </h2>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Lead Data Steward</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {project.contactInfo.dataStewardName}
                </span>
                <div className="text-slate-500 font-mono text-[11px]">
                  {project.contactInfo.dataStewardEmail}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600 text-[11px]">
                <div>
                  <span className="text-slate-400">Technical Lead:</span>{' '}
                  {project.contactInfo.technicalLead}
                </div>
                <div>
                  <span className="text-slate-400">Escalation Email:</span>{' '}
                  <span className="font-mono">{project.contactInfo.escalationEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400">Slack Channel:</span>{' '}
                  <span className="font-mono">{project.contactInfo.slackChannel}</span>
                </div>
                <div>
                  <span className="text-slate-400">Support SLA:</span>{' '}
                  {project.contactInfo.supportSla}
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Security Filters Notice */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Governance & Masking Rules
            </h2>

            {project.filters.length === 0 ? (
              <p className="text-xs text-slate-500">
                No custom cell-level masking rules configured on this project. Standard Lake Formation IAM roles apply.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {project.filters.map((f) => (
                  <div key={f.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="font-semibold text-slate-900">{f.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{f.type}</div>
                    <div className="text-[11px] text-slate-600 mt-1">{f.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestSubscriptionModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        project={project}
        onSuccess={() => setActiveNav('consumer-subscriptions')}
      />
    </div>
  );
};
