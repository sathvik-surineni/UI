/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { StatusBadge } from '../common/StatusBadge';
import { RequestSubscriptionModal } from './RequestSubscriptionModal';
import { Project } from '../../types/dap';
import {
  ShoppingBag,
  Search,
  Filter,
  Database,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const DataMarketplace: React.FC = () => {
  const { projects, navigateToMarketplaceDiscovery } = useDap();

  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [assetTypeFilter, setAssetTypeFilter] = useState('All');
  const [requestModalProject, setRequestModalProject] = useState<Project | null>(null);

  const domains = ['All', 'Financial Analytics', 'Customer Intelligence', 'Healthcare & Life Sciences', 'Infrastructure & Security'];
  const assetTypes = ['All', 'Apache Iceberg', 'Parquet (S3)', 'Amazon Redshift', 'SMUS Feature Group'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.participantName.toLowerCase().includes(search.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesDomain = domainFilter === 'All' || project.domain === domainFilter;
    const matchesAssetType =
      assetTypeFilter === 'All' || project.assets.some((a) => a.type === assetTypeFilter);

    return matchesSearch && matchesDomain && matchesAssetType;
  });

  return (
    <div className="space-y-6">
      {/* Marketplace Hero & Discovery Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Federated Data Mesh
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Enterprise Data Marketplace
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Discover verified datasets, feature groups, and governed lakehouse tables shared by enterprise participant organizations across SageMaker Unified Studio.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Published Datasets</span>
            <span className="text-lg font-bold font-mono text-white">{projects.length} Projects</span>
          </div>
          <div className="h-6 w-px bg-white/20 mx-2" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Catalog Tables</span>
            <span className="text-lg font-bold font-mono text-white">
              {projects.reduce((acc, p) => acc + p.assets.length, 0)} Tables
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets by keywords, tags, or participant..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Storage Engine:</span>
              <select
                value={assetTypeFilter}
                onChange={(e) => setAssetTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-slate-800"
              >
                {assetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Domain Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setDomainFilter(domain)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                domainFilter === domain
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {project.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{project.domain}</span>
              </div>

              <h2
                onClick={() => navigateToMarketplaceDiscovery(project.id)}
                className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer line-clamp-1"
              >
                {project.name}
              </h2>

              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Publisher & Participant */}
              <div className="mt-3 py-2 border-y border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.participantName}</span>
                </div>
                <StatusBadge status={project.sensitivity} size="sm" />
              </div>

              {/* Asset & Schema Summary */}
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Available Assets:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {project.assets.length} dataset(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Primary Engine:</span>
                  <span className="font-medium text-slate-800">
                    {project.assets[0]?.type || 'Lakehouse'}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateToMarketplaceDiscovery(project.id)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                Inspect Schema & Specs
              </button>

              <button
                onClick={() => setRequestModalProject(project)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Request Modal */}
      <RequestSubscriptionModal
        isOpen={!!requestModalProject}
        onClose={() => setRequestModalProject(null)}
        project={requestModalProject}
      />
    </div>
  );
};
