/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { DataFilter, FilterType } from '../../../types/dap';
import { Filter, Plus, Trash2, Edit3, ShieldAlert, Code2, Layers, CheckCircle2, Sliders } from 'lucide-react';

export const TabFilters: React.FC = () => {
  const { selectedProject, addFilter, updateFilter, deleteFilter } = useDap();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<DataFilter | null>(null);

  // Create Form State
  const [filterName, setFilterName] = useState('');
  const [assetId, setAssetId] = useState(selectedProject?.assets[0]?.id || '');
  const [filterType, setFilterType] = useState<FilterType>('Column Masking');
  const [configuration, setConfiguration] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState('');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editAssetId, setEditAssetId] = useState('');
  const [editType, setEditType] = useState<FilterType>('Column Masking');
  const [editConfig, setEditConfig] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editError, setEditError] = useState('');

  if (!selectedProject) return null;

  const handleOpenCreate = () => {
    setFilterName('');
    setAssetId(selectedProject.assets[0]?.id || '');
    setFilterType('Column Masking');
    setConfiguration("MASK column_name USING SHA256_SALT WHEN subscriber.role != 'COMPLIANCE_OFFICER'");
    setDescription('');
    setStatus('Active');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (filter: DataFilter) => {
    setEditingFilter(filter);
    setEditName(filter.name);
    setEditAssetId(filter.assetId);
    setEditType(filter.type);
    setEditConfig(filter.configuration);
    setEditDesc(filter.description);
    setEditStatus(filter.status);
    setEditError('');
  };

  const handleCreateFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterName.trim()) {
      setFormError('Filter Name is required');
      return;
    }
    if (!configuration.trim()) {
      setFormError('Filter configuration SQL expression is required');
      return;
    }

    const matchedAsset = selectedProject.assets.find((a) => a.id === assetId);

    addFilter(selectedProject.id, {
      name: filterName.trim(),
      assetId,
      assetName: matchedAsset?.name || 'Dataset Asset',
      type: filterType,
      configuration: configuration.trim(),
      status,
      description: description.trim() || 'Custom data sharing filter policy.',
      affectedSchemas: matchedAsset ? [matchedAsset.schemaRef] : [],
    });

    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFilter) return;

    if (!editName.trim()) {
      setEditError('Filter name is required');
      return;
    }
    if (!editConfig.trim()) {
      setEditError('Configuration SQL expression is required');
      return;
    }

    const matchedAsset = selectedProject.assets.find((a) => a.id === editAssetId);

    updateFilter(selectedProject.id, editingFilter.id, {
      name: editName.trim(),
      assetId: editAssetId,
      assetName: matchedAsset?.name || editingFilter.assetName,
      type: editType,
      configuration: editConfig.trim(),
      description: editDesc.trim(),
      status: editStatus,
    });

    setEditingFilter(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="enterprise-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Governance Filters & Tenant Data Boundaries
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              SMUS Lake Formation Enforced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Define cell-level column masking, third-party tenant isolation predicates, and row-level access security
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Filter Policy
        </button>
      </div>

      {/* Filters Table */}
      <div className="enterprise-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Filter Policy & ID</th>
                <th className="py-3 px-3">Target Asset</th>
                <th className="py-3 px-3">Filter Mechanism</th>
                <th className="py-3 px-4">Configuration SQL / Expression</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {selectedProject.filters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No active governance filters configured for this project.
                  </td>
                </tr>
              ) : (
                selectedProject.filters.map((filter) => (
                  <tr key={filter.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{filter.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{filter.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {filter.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-slate-800 font-semibold">
                        {filter.assetName}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded font-medium border border-slate-200">
                        {filter.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] bg-slate-950 text-slate-200 border border-slate-800 rounded-md p-2 max-w-md truncate select-all">
                        {filter.configuration}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={filter.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {filter.lastUpdated}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(filter)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
                          title="Edit Filter Parameters"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFilter(selectedProject.id, filter.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Filter Policy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Filter Modal */}
      <Modal
        isOpen={!!editingFilter}
        onClose={() => setEditingFilter(null)}
        title="Edit Governance Filter Policy"
        subtitle={editingFilter ? `Modify configuration for ${editingFilter.name}` : ''}
        maxWidth="xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setEditingFilter(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Save Filter Changes
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          {editError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {editError}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Filter Policy Name *</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Data Asset *</label>
              <select
                value={editAssetId}
                onChange={(e) => setEditAssetId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
              >
                {selectedProject.assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Filter Mechanism *</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as FilterType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
              >
                <option value="Column Masking">Column Masking (SHA-256 / Redaction)</option>
                <option value="Row-Level Security">Row-Level Security (WHERE Predicate)</option>
                <option value="Predicate Filter">Predicate Partition Filter</option>
                <option value="Time Partition">Time Partition Boundary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Configuration SQL / Predicate Expression *
            </label>
            <textarea
              rows={3}
              value={editConfig}
              onChange={(e) => setEditConfig(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-slate-800 bg-slate-900 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Policy Description</label>
              <input
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Enforcement Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800 font-semibold"
              >
                <option value="Active">Active (Enforced)</option>
                <option value="Inactive">Inactive (Suspended)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Create Filter Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Data Governance Filter"
        subtitle={`Enforce cell-level security rules on ${selectedProject.name}`}
        maxWidth="xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateFilter}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Enforce Filter
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateFilter} className="space-y-4 text-xs">
          {formError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Filter Policy Name *</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="e.g. ThirdParty_Account_Masking"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Asset *</label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
              >
                {selectedProject.assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Filter Mechanism *</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-800"
              >
                <option value="Column Masking">Column Masking (SHA-256 / Redaction)</option>
                <option value="Row-Level Security">Row-Level Security (WHERE Predicate)</option>
                <option value="Predicate Filter">Predicate Partition Filter</option>
                <option value="Time Partition">Time Partition Boundary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Configuration SQL / Predicate Expression *
            </label>
            <textarea
              rows={3}
              value={configuration}
              onChange={(e) => setConfiguration(e.target.value)}
              placeholder="e.g. MASK card_number USING LAST_4_DIGITS WHEN subscriber.tenant_id != 'TIER_1_AUDITOR'"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Parsed and compiled by SMUS Lake Formation policy compiler.
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Policy Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Business justification and compliance rationale"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
