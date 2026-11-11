/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { Modal } from '../../common/Modal';
import { StatusBadge } from '../../common/StatusBadge';
import { ProjectMemberRole } from '../../../types/dap';
import { Users2, UserPlus, Shield, Trash2, Mail, Building2 } from 'lucide-react';

export const TabMembers: React.FC = () => {
  const { selectedProject, addProjectMember, removeProjectMember, updateMemberRole, currentParticipant } =
    useDap();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState(currentParticipant?.name || 'FinTech Analytics');
  const [role, setRole] = useState<ProjectMemberRole>('Project Editor');
  const [error, setError] = useState('');

  if (!selectedProject) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Member name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required');
      return;
    }

    addProjectMember(selectedProject.id, {
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim(),
      role,
      status: 'Active',
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Project Members & Access Control</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage granular roles for collaborators contributing to this data project
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
            <tr>
              <th className="py-2.5 px-4">Member Name & Email</th>
              <th className="py-2.5 px-3">Organization</th>
              <th className="py-2.5 px-3">Project Role</th>
              <th className="py-2.5 px-3">Date Added</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {selectedProject.members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{member.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{member.email}</div>
                </td>
                <td className="py-3 px-3 text-slate-800">{member.organization}</td>
                <td className="py-3 px-3">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateMemberRole(selectedProject.id, member.id, e.target.value as ProjectMemberRole)
                    }
                    className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-slate-800"
                  >
                    <option value="Project Admin">Project Admin (Full Control)</option>
                    <option value="Project Editor">Project Editor (Publish & Edit)</option>
                    <option value="Project Viewer">Project Viewer (Read Only)</option>
                  </select>
                </td>
                <td className="py-3 px-3 font-mono text-slate-500">{member.dateAdded}</td>
                <td className="py-3 px-3">
                  <StatusBadge status={member.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => removeProjectMember(selectedProject.id, member.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Project Member"
        subtitle={`Assign access privileges for ${selectedProject.name}`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs"
            >
              Add Member
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Bell"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Corporate Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.bell@organization.aws"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Project Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as ProjectMemberRole)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              >
                <option value="Project Admin">Project Admin</option>
                <option value="Project Editor">Project Editor</option>
                <option value="Project Viewer">Project Viewer</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
