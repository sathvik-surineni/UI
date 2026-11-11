/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import { Modal } from '../common/Modal';
import { Cpu, Database, ShieldCheck, Share2, Layers, CheckCircle2 } from 'lucide-react';

export const SmusBridgeModal: React.FC = () => {
  const { isSmusBridgeOpen, setIsSmusBridgeOpen, currentParticipant } = useDap();

  return (
    <Modal
      isOpen={isSmusBridgeOpen}
      onClose={() => setIsSmusBridgeOpen(false)}
      title="SageMaker Unified Studio (SMUS) DAP Bridge Architecture"
      subtitle="Enterprise Data Sharing Platform integration with AWS Lake Formation & Glue Catalog"
      maxWidth="2xl"
      footer={
        <button
          onClick={() => setIsSmusBridgeOpen(false)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          Close Topology
        </button>
      }
    >
      <div className="space-y-6 text-xs text-slate-600">
        <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono">
          <div className="text-[11px] text-slate-400 mb-2">// ACTIVE SMUS CLUSTER RUNTIME</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400">Cluster ID:</span> {currentParticipant?.smusClusterId}
            </div>
            <div>
              <span className="text-slate-400">Region:</span> {currentParticipant?.region}
            </div>
            <div>
              <span className="text-slate-400">Lake Formation:</span> ENFORCED (V2 ARNs)
            </div>
            <div>
              <span className="text-slate-400">Catalog Engine:</span> AWS Glue + Iceberg REST
            </div>
          </div>
        </div>

        {/* 3-Tier Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Layers className="w-4 h-4 text-indigo-600" />
              1. Data Producer
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Producers register Apache Iceberg, S3 Parquet, or Redshift tables in DAP, assign schemas, and define row/column level masking filters.
            </p>
          </div>

          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. DAP Governance Mesh
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Synchronizes metadata with SMUS, tracks schema drift, manages multi-participant subscriptions, and generates contact information.
            </p>
          </div>

          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Share2 className="w-4 h-4 text-blue-600" />
              3. Data Consumer
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consumers discover catalog assets in Data Marketplace, request access with SLA tier, and query directly from SMUS notebooks upon approval.
            </p>
          </div>
        </div>

        {/* Key Guarantees */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs font-semibold text-slate-900 mb-2.5">
            Key Governance & Security Guarantees:
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Data Duplication:</strong> Data remains in producer S3 buckets; SMUS provisions cross-account Lake Formation read grants with cell-level filters.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Schema Drift Detection:</strong> DAP runs automated delta validation during Project Sync to verify upstream DDL matches shared contracts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Audit Immutability:</strong> Every subscription approval, rejection, sync trigger, and role assignment is written to the immutable DAP audit ledger.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
