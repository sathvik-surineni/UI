/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import { Bell, CheckCircle2, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    auditLogs,
    projects,
    navigateToProjectWorkspace,
    setCurrentRole,
  } = useDap();

  // Find all pending subscriptions across projects
  const pendingRequests = projects.flatMap((p) =>
    p.subscriptions
      .filter((s) => s.status === 'Pending')
      .map((s) => ({ ...s, project: p }))
  );

  return (
    <Drawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Platform Alerts & Activity"
      subtitle="Real-time subscriptions, governance events, and sync triggers"
      width="lg"
    >
      <div className="space-y-6">
        {/* Pending Subscriptions Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Pending Action Required ({pendingRequests.length})
            </h3>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
              No pending subscription approval requests
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {req.subscriberName} ({req.subscriberOrg})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Requested access to {req.project.name}
                      </div>
                    </div>
                    <StatusBadge status="Pending" size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 italic">"{req.justification}"</p>

                  <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[11px]">
                    <span className="text-slate-400 font-mono">{req.requestDate}</span>
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setCurrentRole('PRODUCER');
                        navigateToProjectWorkspace(req.projectId, 'subscriptions');
                      }}
                      className="text-amber-800 font-medium hover:underline flex items-center gap-1"
                    >
                      Review Request <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Stream */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-slate-500" />
              Recent Audit Stream
            </h3>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
            {auditLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 font-mono">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">{log.details}</div>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-mono">
                  <span>Actor: {log.actor}</span>
                  <span>·</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
