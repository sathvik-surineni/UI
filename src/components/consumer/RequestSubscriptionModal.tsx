/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { Modal } from '../common/Modal';
import { Project, SlaTier } from '../../types/dap';
import { ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';

interface RequestSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess?: () => void;
}

export const RequestSubscriptionModal: React.FC<RequestSubscriptionModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
}) => {
  const { requestSubscription } = useDap();

  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    project ? project.assets.map((a) => a.name) : []
  );
  const [slaTier, setSlaTier] = useState<SlaTier>('Silver (4h)');
  const [justification, setJustification] = useState('');
  const [targetWorkspace, setTargetWorkspace] = useState('smus-ws-consumer-lab-01');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  if (!project) return null;

  const toggleAsset = (name: string) => {
    setSelectedAssets((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssets.length === 0) {
      setError('Please select at least one data asset to subscribe to.');
      return;
    }
    if (!justification.trim() || justification.trim().length < 15) {
      setError('Please provide a substantive business justification (minimum 15 characters).');
      return;
    }
    if (!agreedToTerms) {
      setError('You must accept the DAP Data Governance & Privacy Terms to proceed.');
      return;
    }

    requestSubscription({
      projectId: project.id,
      requestedAssets: selectedAssets,
      justification: justification.trim(),
      slaTier,
      targetWorkspace: targetWorkspace.trim(),
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Data Access Subscription"
      subtitle={`Submit access lease for ${project.name}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs"
          >
            Submit Request to Producer
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Project Target */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target Project & Owner
          </div>
          <div className="font-semibold text-slate-900 mt-0.5">{project.name}</div>
          <div className="text-slate-500 text-[11px]">
            Owner: {project.ownerName} ({project.participantName})
          </div>
        </div>

        {/* Assets Selection */}
        <div>
          <label className="block font-medium text-slate-700 mb-1.5">
            Select Data Assets to Include <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-white">
            {project.assets.map((asset) => (
              <label
                key={asset.id}
                className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset.name)}
                  onChange={() => toggleAsset(asset.name)}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <div className="font-mono font-semibold text-slate-900">{asset.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {asset.type} · {asset.rowCount} rows · {asset.sizeBytes}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SLA and Target Workspace */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Desired SLA Tier</label>
            <select
              value={slaTier}
              onChange={(e) => setSlaTier(e.target.value as SlaTier)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
            >
              <option value="Standard (24h)">Standard (24h SLA)</option>
              <option value="Silver (4h)">Silver (4h SLA)</option>
              <option value="Gold (<15m)">Gold (&lt;15m SLA)</option>
              <option value="Mission-Critical (<1m)">Mission-Critical (&lt;1m Real-Time)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">SMUS Target Workspace</label>
            <input
              type="text"
              value={targetWorkspace}
              onChange={(e) => setTargetWorkspace(e.target.value)}
              placeholder="e.g. smus-ws-analytics-02"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        {/* Business Justification */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Business Justification & Access Purpose <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explain how this dataset will be utilized, expected queries, and retention timeline..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
          />
        </div>

        {/* Terms Agreement */}
        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-[11px] text-slate-600 leading-relaxed">
            I certify that our participant organization complies with cross-account data governance
            policies and will not export or distribute raw unmasked PII records outside of authorized
            SMUS compute instances.
          </span>
        </label>
      </form>
    </Modal>
  );
};
