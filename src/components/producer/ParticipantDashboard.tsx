/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  FolderKanban,
  HardDrive,
  Users2,
  Clock,
  Filter,
  History,
  RefreshCw,
  FileCheck2,
  ArrowUpRight,
  ShoppingBag,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ParticipantDashboard: React.FC = () => {
  const {
    projects,
    currentParticipant,
    navigateToProjectWorkspace,
    navigateToMarketplaceDiscovery,
    setActiveNav,
  } = useDap();

  const [activeTab, setActiveTab] = useState<'owned' | 'consumed' | 'marketplace'>('owned');

  // Participant metrics
  const ownedProjects = projects.filter(
    (p) => !currentParticipant || p.participantId === currentParticipant.id || p.participantId === 'part-fintech-core'
  );
  const totalAssets = ownedProjects.reduce((acc, p) => acc + p.assets.length, 0);

  // Consumed subscriptions across all projects
  const mySubscriptions = projects.flatMap((p) =>
    p.subscriptions.map((s) => ({ ...s, project: p }))
  );
  const approvedSubscriptions = mySubscriptions.filter((s) => s.status === 'Approved');
  const pendingRequests = projects.flatMap((p) =>
    p.subscriptions.filter((s) => s.status === 'Pending').map((s) => ({ ...s, project: p }))
  );

  return (
    <div className="space-y-6">
      {/* Participant Header with clean Wayfarer CSS coating */}
      <div className="enterprise-card p-6 bg-gradient-to-r from-white via-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Participant Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Centralized hub for managing your published data projects, monitoring consumer subscriptions, and discovering shared lakehouse catalogs in the marketplace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveNav('producer-contact-generator')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            Contract Generator
          </button>
          <button
            onClick={() => setActiveNav('consumer-marketplace')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            Marketplace
          </button>
        </div>
      </div>

      {/* KPI Cards Strip: 5 Cards requested */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KpiCard
          label="Owned Projects"
          value={ownedProjects.length}
          sublabel="Published datasets"
          icon={FolderKanban}
          onClick={() => setActiveTab('owned')}
          isActive={activeTab === 'owned'}
        />
        <KpiCard
          label="Data Assets"
          value={totalAssets}
          sublabel="Iceberg & Redshift tables"
          icon={HardDrive}
        />
        <KpiCard
          label="Active Subscriptions"
          value={approvedSubscriptions.length}
          sublabel="Granted consumer shares"
          icon={KeyRound}
          onClick={() => setActiveTab('consumed')}
          isActive={activeTab === 'consumed'}
        />
        <KpiCard
          label="Pending Approvals"
          value={pendingRequests.length}
          sublabel={pendingRequests.length > 0 ? 'Requires decision' : 'All clear'}
          icon={Clock}
          trend={pendingRequests.length > 0 ? { value: `${pendingRequests.length} awaiting review` } : undefined}
          isActive={pendingRequests.length > 0}
          onClick={() => setActiveTab('owned')}
        />
        <KpiCard
          label="Catalog Discovery"
          value={projects.length}
          sublabel="Marketplace datasets"
          icon={ShoppingBag}
          onClick={() => setActiveTab('marketplace')}
          isActive={activeTab === 'marketplace'}
        />
      </div>

      {/* Segmented View Selector: Owned Projects vs Consumed Subscriptions vs Marketplace */}
      <div className="enterprise-card p-1.5 flex items-center gap-1 bg-slate-100/80 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('owned')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'owned'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>My Owned Projects ({ownedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consumed')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'consumed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Consumed Subscriptions ({mySubscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'marketplace'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Marketplace Feed</span>
        </button>
      </div>

      {/* Tab 1: Owned Projects (Producer Features) */}
      {activeTab === 'owned' && (
        <div className="space-y-6">
          <div className="enterprise-card overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Published Data Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Projects registered and hosted under your participant tenant
                </p>
              </div>
              <button
                onClick={() => setActiveNav('producer-projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                View all projects →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Project Name & Code</th>
                    <th className="py-3 px-3">Domain</th>
                    <th className="py-3 px-3">Data Assets</th>
                    <th className="py-3 px-3">Active Subscriptions</th>
                    <th className="py-3 px-3">Sync Posture</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ownedProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                          className="font-bold text-slate-900 text-left hover:text-indigo-600 hover:underline block truncate max-w-xs cursor-pointer"
                        >
                          {proj.name}
                        </button>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {proj.code} · {proj.smusWorkspace}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-800 font-medium">{proj.domain}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        {proj.assets.length}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-800 font-semibold">
                        {proj.subscriptions.filter((s) => s.status === 'Approved').length}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                        {proj.lastSyncedAt}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={proj.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigateToProjectWorkspace(proj.id, 'overview')}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                        >
                          Workspace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals Box */}
          {pendingRequests.length > 0 && (
            <div className="enterprise-card p-5 border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Pending Approvals ({pendingRequests.length})
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-white border border-amber-200/80 rounded-lg shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {req.subscriberName} ({req.subscriberOrg})
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Target: {req.project.name}
                        </div>
                      </div>
                      <StatusBadge status="Pending" size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 italic">"{req.justification}"</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">{req.requestDate}</span>
                      <button
                        onClick={() => navigateToProjectWorkspace(req.projectId, 'subscriptions')}
                        className="font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        Review & Approve →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Consumed Projects & Subscriptions (Consumer Features) */}
      {activeTab === 'consumed' && (
        <div className="space-y-4">
          <div className="enterprise-card overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Subscribed Lakehouse Datasets & Active Leases
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cross-tenant data shares currently leased to your participant instances
                </p>
              </div>
              <button
                onClick={() => setActiveNav('consumer-subscriptions')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Manage all subscriptions →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Project & Code</th>
                    <th className="py-3 px-3">Producer Participant</th>
                    <th className="py-3 px-3">Included Tables</th>
                    <th className="py-3 px-3">SLA Commitment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Credentials & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mySubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => navigateToMarketplaceDiscovery(sub.projectId)}
                          className="font-bold text-slate-900 hover:text-indigo-600 hover:underline block truncate max-w-xs cursor-pointer"
                        >
                          {sub.projectName}
                        </button>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {sub.project.code}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-800 font-medium">
                        {sub.project.participantName}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-slate-800 font-semibold">
                          {sub.requestedAssets.length} asset(s)
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">{sub.slaTier}</td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveNav('consumer-subscriptions')}
                          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                        >
                          View Endpoint
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Marketplace Highlights */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Featured Marketplace Catalogs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore datasets shared by other participant clusters ready for cross-account subscription
              </p>
            </div>
            <button
              onClick={() => setActiveNav('consumer-marketplace')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              Browse Full Marketplace ({projects.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="enterprise-card p-5 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                      {proj.code}
                    </span>
                    <StatusBadge status={proj.sensitivity} size="sm" />
                  </div>
                  <h3
                    onClick={() => navigateToMarketplaceDiscovery(proj.id)}
                    className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                  >
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{proj.participantName}</span>
                    <span className="font-mono font-semibold text-slate-800">{proj.assets.length} assets</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigateToMarketplaceDiscovery(proj.id)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    Inspect Specs
                  </button>
                  <button
                    onClick={() => navigateToMarketplaceDiscovery(proj.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
