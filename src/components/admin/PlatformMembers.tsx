/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { Drawer } from '../common/Drawer';
import { PlatformUser } from '../../types/dap';
import {
  Users2,
  Search,
  Building2,
  Shield,
  Clock,
  Mail,
  UserCheck,
  FolderGit2,
} from 'lucide-react';

export const PlatformMembers: React.FC = () => {
  const { platformUsers, participants, setActiveNav } = useDap();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const filtered = platformUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.participantName.toLowerCase().includes(search.toLowerCase()) ||
      u.systemRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Members Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global directory of federated users, system permissions, and cross-project memberships
          </p>
        </div>

        <button
          onClick={() => setActiveNav('admin-access')}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Shield className="w-4 h-4" />
          Assign Project Admin Privileges
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search platform members by name, email, role, or participant..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Member Name & Email</th>
                <th className="py-2.5 px-3">Participant Tenant</th>
                <th className="py-2.5 px-3">Platform System Role</th>
                <th className="py-2.5 px-3">Associated Projects</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline block text-left"
                    >
                      {user.name}
                    </button>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{user.participantName}</td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {user.systemRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {user.associatedProjects.length} project(s)
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={user.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {user.lastActivity}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Drawer */}
      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? selectedUser.name : 'Platform Member'}
        subtitle={selectedUser ? `${selectedUser.systemRole} · ${selectedUser.participantName}` : ''}
        width="lg"
        footer={
          <button
            onClick={() => setSelectedUser(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
          >
            Close
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Identity Specs */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Corporate Email</span>
                  <span className="font-mono text-slate-900">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Participant</span>
                  <span className="font-medium text-slate-900">{selectedUser.participantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Global Role</span>
                  <span className="font-medium text-slate-900">{selectedUser.systemRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Account Status</span>
                  <span className="font-medium text-emerald-700">{selectedUser.status}</span>
                </div>
              </div>
            </div>

            {/* Associated Project Memberships */}
            <div>
              <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-slate-500" />
                Project Memberships & Assigned Roles ({selectedUser.associatedProjects.length})
              </h3>

              {selectedUser.associatedProjects.length === 0 ? (
                <p className="text-xs text-slate-400 italic border border-dashed rounded-lg p-4 text-center">
                  User is not currently assigned to any specific project roles.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                  {selectedUser.associatedProjects.map((p, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{p.projectName}</span>
                      <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {p.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
