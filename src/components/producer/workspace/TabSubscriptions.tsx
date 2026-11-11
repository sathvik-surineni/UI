/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Drawer } from '../../common/Drawer';
import { Modal } from '../../common/Modal';
import { SubscriptionRequest, SubscriptionStatus } from '../../../types/dap';
import {
  Users2,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Building,
  KeyRound,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const TabSubscriptions: React.FC = () => {
  const { selectedProject, approveSubscription, rejectSubscription, revokeSubscription } = useDap();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedSub, setSelectedSub] = useState<SubscriptionRequest | null>(null);

  // Approval modal state
  const [approvingSub, setApprovingSub] = useState<SubscriptionRequest | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  // Rejection modal state
  const [rejectingSub, setRejectingSub] = useState<SubscriptionRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  if (!selectedProject) return null;

  const subscriptions = selectedProject.subscriptions.filter((s) => {
    if (statusFilter === 'All') return true;
    return s.status === statusFilter;
  });

  const handleApproveConfirm = () => {
    if (!approvingSub) return;
    approveSubscription(selectedProject.id, approvingSub.id, approvalNote);
    setApprovingSub(null);
    setApprovalNote('');
    if (selectedSub?.id === approvingSub.id) {
      setSelectedSub(null);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectingSub) return;
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a reason for rejecting this access request.');
      return;
    }
    rejectSubscription(selectedProject.id, rejectingSub.id, rejectionReason.trim());
    setRejectingSub(null);
    setRejectionReason('');
    setRejectionError('');
    if (selectedSub?.id === rejectingSub.id) {
      setSelectedSub(null);
    }
  };

  const pendingCount = selectedProject.subscriptions.filter((s) => s.status === 'Pending').length;

  return (
    <div className="space-y-4">
      {/* Filter Tabs Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected', 'Revoked'].map((status) => {
            const count =
              status === 'All'
                ? selectedProject.subscriptions.length
                : selectedProject.subscriptions.filter((s) => s.status === status).length;
            const isCurrent = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isCurrent ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {pendingCount > 0 && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} request(s) awaiting your decision
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Subscriber Name & Org</th>
                <th className="py-2.5 px-3">Requested Assets</th>
                <th className="py-2.5 px-3">SLA Tier</th>
                <th className="py-2.5 px-3">Request Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No subscriptions found for status "{statusFilter}".
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{sub.subscriberName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{sub.subscriberOrg}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-800">
                        {sub.requestedAssets.length} asset(s)
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                        {sub.requestedAssets.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{sub.slaTier}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {sub.requestDate}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                        >
                          View Details
                        </button>

                        {sub.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => setApprovingSub(sub)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingSub(sub)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {sub.status === 'Approved' && (
                          <button
                            onClick={() => revokeSubscription(selectedProject.id, sub.id)}
                            className="px-2 py-1 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Revoke active sharing tokens"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Request Details Drawer */}
      <Drawer
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={selectedSub ? `Subscription Request #${selectedSub.id}` : 'Request Details'}
        subtitle={selectedSub ? `${selectedSub.subscriberOrg} · ${selectedSub.status}` : ''}
        width="xl"
        footer={
          selectedSub && selectedSub.status === 'Pending' ? (
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                onClick={() => setRejectingSub(selectedSub)}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
              >
                Reject Request
              </button>
              <button
                onClick={() => setApprovingSub(selectedSub)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-xs"
              >
                Approve Subscription
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSelectedSub(null)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800"
            >
              Close
            </button>
          )
        }
      >
        {selectedSub && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Subscriber Info Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Subscriber Identity & Environment
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Name:</span>{' '}
                  <span className="font-semibold text-slate-900">{selectedSub.subscriberName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <span className="font-mono">{selectedSub.subscriberEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400">Organization:</span>{' '}
                  <span className="font-medium">{selectedSub.subscriberOrg}</span>
                </div>
                <div>
                  <span className="text-slate-400">Target SMUS Workspace:</span>{' '}
                  <span className="font-mono text-slate-800">
                    {selectedSub.targetSmusWorkspace || 'Default Cloud Workspace'}
                  </span>
                </div>
              </div>
            </div>

            {/* Requested Assets */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2">Requested Data Assets</h4>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                {selectedSub.requestedAssets.map((assetName, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <span className="font-mono font-medium text-slate-900">{assetName}</span>
                    <span className="text-[11px] text-slate-400">
                      Lake Formation Direct SQL Grant
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Justification */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                Business Justification & Intent
              </h4>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed italic">
                "{selectedSub.justification}"
              </div>
            </div>

            {/* SLA and Status details */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <span className="text-slate-400">SLA Expectation:</span>{' '}
                <span className="font-medium text-slate-900">{selectedSub.slaTier}</span>
              </div>
              <div>
                <span className="text-slate-400">Access Level:</span>{' '}
                <span className="font-medium text-slate-900">{selectedSub.accessLevel}</span>
              </div>
              {selectedSub.decidedAt && (
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400">Decision Recorded:</span>{' '}
                  <span className="font-mono">{selectedSub.decidedAt}</span> by {selectedSub.decidedBy}
                </div>
              )}
              {selectedSub.rejectionReason && (
                <div className="col-span-2 p-2 bg-rose-50 border border-rose-200 rounded text-rose-700">
                  <strong>Rejection Note:</strong> {selectedSub.rejectionReason}
                </div>
              )}
              {selectedSub.connectionEndpoint && (
                <div className="col-span-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-mono text-[11px] break-all">
                  <strong>Connection Endpoint:</strong> {selectedSub.connectionEndpoint}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={!!approvingSub}
        onClose={() => setApprovingSub(null)}
        title="Approve Data Sharing Subscription"
        subtitle={`Grant access to ${approvingSub?.subscriberOrg}`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setApprovingSub(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveConfirm}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              Confirm Approval
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            You are about to authorize <strong>{approvingSub?.subscriberName}</strong> from{' '}
            <strong>{approvingSub?.subscriberOrg}</strong> to query the requested tables in{' '}
            <strong>{selectedProject.name}</strong>.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-600" />
            Temporary AWS Lake Formation tokens and schema grants will be issued immediately.
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Internal Approval Note (Optional)
            </label>
            <textarea
              rows={2}
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="e.g. Authorized under Master Data Sharing Agreement schedule 4B"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={!!rejectingSub}
        onClose={() => setRejectingSub(null)}
        title="Reject Subscription Request"
        subtitle={`Decline request from ${rejectingSub?.subscriberOrg}`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setRejectingSub(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            Please provide a governance justification for rejecting this request. The subscriber
            will receive this explanation.
          </p>
          {rejectionError && (
            <div className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs">
              {rejectionError}
            </div>
          )}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incompatible compliance clearance: missing secondary GDPR addendum."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
