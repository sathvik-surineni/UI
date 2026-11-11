/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { Modal } from '../common/Modal';
import { Project } from '../../types/dap';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createProject, currentParticipant } = useDap();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [domain, setDomain] = useState('Financial Analytics');
  const [description, setDescription] = useState('');
  const [sensitivity, setSensitivity] = useState<Project['sensitivity']>('Internal');
  const [smusWorkspace, setSmusWorkspace] = useState('smus-ws-lakehouse-01');
  const [tagInput, setTagInput] = useState('SMUS, Data-Mesh');
  const [errors, setErrors] = useState<{ name?: string; code?: string; description?: string }>({});

  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setCode(val.toUpperCase().replace(/[^A-Z0-9]/g, '-').substring(0, 24));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!code.trim()) newErrors.code = 'Project code is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created = createProject({
      name,
      code,
      description,
      domain,
      sensitivity,
      smusWorkspace,
      tags,
    });

    onClose();
    if (onSuccess) {
      onSuccess(created.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Data Project"
      subtitle={`Register a data project under ${currentParticipant?.name || 'Active Participant'}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Create Project
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Project Name */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Enterprise Fraud Risk Features"
            className={`w-full px-3 py-2 border rounded-lg text-xs ${
              errors.name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
            } focus:outline-hidden focus:ring-1 focus:ring-slate-800`}
          />
          {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
        </div>

        {/* Project Code & Domain */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Project Identifier Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. FRAUD-RISK-FEAT"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
            {errors.code && <p className="text-rose-600 text-[11px] mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            >
              <option value="Financial Analytics">Financial Analytics</option>
              <option value="Customer Intelligence">Customer Intelligence</option>
              <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
              <option value="Infrastructure & Security">Infrastructure & Security</option>
              <option value="Supply Chain & Operations">Supply Chain & Operations</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Project Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the business purpose, included lakehouse tables, update frequency, and access requirements..."
            className={`w-full px-3 py-2 border rounded-lg text-xs ${
              errors.description ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
            } focus:outline-hidden focus:ring-1 focus:ring-slate-800`}
          />
          {errors.description && (
            <p className="text-rose-600 text-[11px] mt-1">{errors.description}</p>
          )}
        </div>

        {/* Sensitivity & SMUS Workspace */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Data Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as Project['sensitivity'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            >
              <option value="Public">Public (Open for discovery)</option>
              <option value="Internal">Internal (Organization only)</option>
              <option value="Confidential">Confidential (Requires approval)</option>
              <option value="Restricted">Restricted (High-security & NDA)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Target SMUS Workspace</label>
            <input
              type="text"
              value={smusWorkspace}
              onChange={(e) => setSmusWorkspace(e.target.value)}
              placeholder="e.g. smus-ws-lakehouse-01"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">Tags (Comma-separated)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g. Iceberg, Real-Time, PCI-DSS"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </form>
    </Modal>
  );
};
