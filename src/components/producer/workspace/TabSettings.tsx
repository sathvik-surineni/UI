/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { Project } from '../../../types/dap';
import { Sliders, Save, AlertTriangle, Archive } from 'lucide-react';

export const TabSettings: React.FC = () => {
  const { selectedProject, updateProject } = useDap();

  const [name, setName] = useState(selectedProject?.name || '');
  const [description, setDescription] = useState(selectedProject?.description || '');
  const [sensitivity, setSensitivity] = useState(selectedProject?.sensitivity || 'Restricted');
  const [smusWorkspace, setSmusWorkspace] = useState(selectedProject?.smusWorkspace || '');
  const [tagInput, setTagInput] = useState(selectedProject?.tags.join(', ') || '');

  if (!selectedProject) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateProject(selectedProject.id, {
      name,
      description,
      sensitivity,
      smusWorkspace,
      tags,
    });
  };

  const handleToggleArchive = () => {
    const newStatus = selectedProject.status === 'Archived' ? 'Active' : 'Archived';
    updateProject(selectedProject.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 max-w-3xl text-xs">
      {/* General Settings */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Project Governance Settings</h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Configure project identity, sensitivity tier, and SMUS Lake Formation workspace
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Data Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as Project['sensitivity'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
            >
              <option value="Public">Public (Open for discovery)</option>
              <option value="Internal">Internal (Organization only)</option>
              <option value="Confidential">Confidential (Requires approval)</option>
              <option value="Restricted">Restricted (High-security & NDA)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">SMUS Workspace Target</label>
            <input
              type="text"
              value={smusWorkspace}
              onChange={(e) => setSmusWorkspace(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Project Tags</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Comma-separated tags"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h4 className="text-sm font-semibold text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Archive Project
        </h4>
        <p className="text-slate-600 text-xs leading-relaxed">
          Archiving this project suspends automatic catalog sync runs and disables new subscription
          requests on the Data Marketplace. Existing approved consumers retain read access until
          leases expire.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleArchive}
            className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            {selectedProject.status === 'Archived' ? 'Reactivate Project' : 'Archive Project'}
          </button>
        </div>
      </div>
    </div>
  );
};
