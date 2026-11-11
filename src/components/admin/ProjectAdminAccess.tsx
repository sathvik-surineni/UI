/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  FolderGit2,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ProjectAdminAccess: React.FC = () => {
  const {
    participants,
    projects,
    platformUsers,
    assignProjectAdmin,
    revokeProjectAdmin,
  } = useDap();

  // Wizard state
  const [selectedParticipantId, setSelectedParticipantId] = useState(participants[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [selectedUserId, setSelectedUserId] = useState(platformUsers[0]?.id || '');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const availableProjects = projects.filter((p) => p.participantId === selectedParticipantId);
  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedUser = platformUsers.find((u) => u.id === selectedUserId);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipantId || !selectedProjectId || !selectedUserId) return;

    assignProjectAdmin(
      selectedParticipantId,
      selectedProjectId,
      selectedUserId,
      assignmentNote.trim()
    );

    setIsSuccessMessageVisible(true);
    setAssignmentNote('');
    setTimeout(() => setIsSuccessMessageVisible(false), 4000);
  };

  // Compile all active assignments across participants
  const allAssignments = participants.flatMap((part) =>
    part.assignedProjectAdmins.map((adm) => ({
      ...adm,
      participantId: part.id,
      participantName: part.name,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Project Administrator Access Management
          </h1>
          <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
            DELEGATED GOVERNANCE
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Delegate project-level administration authority to qualified data architects and engineers without granting full DAP platform superadmin privileges
        </p>
      </div>

      {/* Privileges Distinction Notice */}
      <div className="bg-slate-900 text-white rounded-xl p-4 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <strong className="text-slate-100">DAP Admin vs Project Admin Distinction:</strong>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed max-w-3xl">
            <strong>DAP Platform Admins</strong> manage cross-tenant clusters, global participants, and security audit policies.
            <strong> Project Admins</strong> can only manage assets, execute syncs, and approve subscription requests for their assigned project.
          </p>
        </div>
      </div>

      {/* 2-Column: Assignment Form & Current Assignments Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (2 spans): Guided Assignment Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-slate-500" />
              Delegate Project Admin Access
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Select tenant, project, and engineer to delegate administrative rights
            </p>
          </div>

          {isSuccessMessageVisible && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Project Administrator access granted successfully.</span>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-4 text-xs">
            {/* Step 1: Select Participant */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Step 1: Select Participant Tenant *
              </label>
              <select
                value={selectedParticipantId}
                onChange={(e) => {
                  setSelectedParticipantId(e.target.value);
                  const matching = projects.filter((p) => p.participantId === e.target.value);
                  if (matching.length > 0) setSelectedProjectId(matching[0].id);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-800"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Project */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Step 2: Select Target Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-800"
              >
                {availableProjects.length === 0 ? (
                  <option value="">No projects in this participant</option>
                ) : (
                  availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Step 3: Select User */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Step 3: Select Candidate User *
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-800"
              >
                {platformUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.systemRole} ({u.participantName})
                  </option>
                ))}
              </select>
            </div>

            {/* Notes / Rationale */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Delegation Audit Justification
              </label>
              <textarea
                rows={2}
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="e.g. Designating Lead Data Architect for Q4 lakehouse schema management"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedProjectId}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Confirm Project Admin Assignment
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (3 spans): Current Project Admin Delegations */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Active Project Administrator Delegations
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Users currently empowered with project administration rights
              </p>
            </div>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
              {allAssignments.length} Assigned
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Administrator</th>
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3">Assigned Date</th>
                  <th className="py-2.5 px-3 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No active project admin delegations.
                    </td>
                  </tr>
                ) : (
                  allAssignments.map((adm, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {adm.userName}
                      </td>
                      <td className="py-3 px-3 font-medium text-indigo-700">
                        {adm.projectName}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{adm.participantName}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {adm.assignedAt}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            revokeProjectAdmin(adm.participantId, adm.projectId, adm.userId)
                          }
                          className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded transition-colors"
                          title="Revoke Admin Access"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
