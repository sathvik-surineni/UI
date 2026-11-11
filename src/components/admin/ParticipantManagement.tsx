/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import { Modal } from '../common/Modal';
import { Participant } from '../../types/dap';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Users2,
  Cpu,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const ParticipantManagement: React.FC = () => {
  const {
    participants,
    projects,
    setActiveNav,
    navigateToProjectWorkspace,
    showToast,
  } = useDap();

  const [search, setSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Participant form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('us-east-1 (N. Virginia)');
  const [contactEmail, setContactEmail] = useState('');

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase())
  );

  const participantProjects = selectedParticipant
    ? projects.filter((p) => p.participantId === selectedParticipant.id)
    : [];

  const handleCreateParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    showToast('success', 'Participant Tenant Provisioned', `Tenant "${name}" successfully registered into DAP federation.`);
    setIsAddModalOpen(false);
    setName('');
    setCode('');
    setDescription('');
    setContactEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Participant Tenants</h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision and govern enterprise organizational units, SMUS cluster identities, and project administrator delegates
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Participant Tenant
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants by name, cluster code, or region..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Participant Name & Code</th>
                <th className="py-2.5 px-3">Primary Region</th>
                <th className="py-2.5 px-3">SMUS Cluster ID</th>
                <th className="py-2.5 px-3">Projects</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Designated Admins</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedParticipant(part)}
                      className="font-semibold text-slate-900 text-left hover:text-indigo-600 hover:underline block"
                    >
                      {part.name}
                    </button>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{part.code}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-800">{part.region}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {part.smusClusterId}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">
                    {part.projectsCount}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{part.membersCount}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {part.assignedProjectAdmins.length} assigned
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={part.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedParticipant(part)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setActiveNav('admin-access')}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded"
                      >
                        Assign Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Inspector Drawer */}
      <Drawer
        isOpen={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        title={selectedParticipant ? selectedParticipant.name : 'Participant Details'}
        subtitle={selectedParticipant ? `${selectedParticipant.code} · ${selectedParticipant.region}` : ''}
        width="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                setSelectedParticipant(null);
                setActiveNav('admin-access');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
            >
              Assign Project Administrator Access →
            </button>
            <button
              onClick={() => setSelectedParticipant(null)}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedParticipant && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Cluster Configuration */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                SMUS Lake Formation Cluster Binding
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cluster ID</span>
                  <span className="font-mono font-medium text-slate-900">
                    {selectedParticipant.smusClusterId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cloud Region</span>
                  <span className="font-medium text-slate-900">{selectedParticipant.region}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tenant Liaison Email</span>
                  <span className="font-mono text-slate-700">
                    {selectedParticipant.contactEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Provisioned Date</span>
                  <span className="font-mono text-slate-700">{selectedParticipant.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Designated Project Admins */}
            <div>
              <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Project Administrator Delegations ({selectedParticipant.assignedProjectAdmins.length})
              </h3>
              {selectedParticipant.assignedProjectAdmins.length === 0 ? (
                <div className="p-4 border border-dashed rounded-lg text-slate-400 text-center text-xs">
                  No individual project administrators explicitly delegated yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                  {selectedParticipant.assignedProjectAdmins.map((adm, i) => (
                    <div key={i} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{adm.userName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Assigned to: {adm.projectName}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {adm.assignedAt} by {adm.assignedBy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Owned Projects */}
            <div>
              <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-slate-500" />
                Associated Data Projects ({participantProjects.length})
              </h3>
              <div className="space-y-2">
                {participantProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 bg-white"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.code} · {p.assets.length} assets · {p.domain}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedParticipant(null);
                        navigateToProjectWorkspace(p.id, 'overview');
                      }}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      Open →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Participant Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Participant Tenant"
        subtitle="Register a new enterprise participant into the DAP federation"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateParticipant}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs"
            >
              Provision Tenant
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateParticipant} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Participant Legal Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Quant Research Labs"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Cluster Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. APEX-QUANT"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">AWS Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-800"
              >
                <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                <option value="us-west-2 (Oregon)">us-west-2 (Oregon)</option>
                <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</option>
                <option value="ap-southeast-1 (Singapore)">ap-southeast-1 (Singapore)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Security / Liaison Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="data-liaison@organization.aws"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
