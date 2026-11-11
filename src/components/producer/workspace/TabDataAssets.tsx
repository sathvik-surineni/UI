/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Drawer } from '../../common/Drawer';
import { DataAsset } from '../../../types/dap';
import {
  Search,
  HardDrive,
  ExternalLink,
  Code2,
  Database,
  Filter,
  Layers,
  Table,
  CheckCircle2,
  Eye,
} from 'lucide-react';

export const TabDataAssets: React.FC = () => {
  const { selectedProject, setProjectActiveTab } = useDap();
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<DataAsset | null>(null);

  if (!selectedProject) return null;

  const assets = selectedProject.assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  const matchedSchema = selectedAsset
    ? selectedProject.schemas.find((s) => s.id === selectedAsset.schemaRef)
    : null;

  const affectingFilters = selectedAsset
    ? selectedProject.filters.filter((f) => f.assetId === selectedAsset.id)
    : [];

  return (
    <div className="space-y-4">
      {/* Action & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search data assets by name, engine, or description..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            {assets.length} of {selectedProject.assets.length} Assets
          </span>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4">Asset Name & ID</th>
                <th className="py-2.5 px-3">Storage Type</th>
                <th className="py-2.5 px-3">Schema</th>
                <th className="py-2.5 px-3">Metadata Status</th>
                <th className="py-2.5 px-3">Sharing Status</th>
                <th className="py-2.5 px-3">Volume & Rows</th>
                <th className="py-2.5 px-3">Last Updated</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No data assets match your filter.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 font-mono flex items-center gap-2">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{asset.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{asset.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{asset.type}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setProjectActiveTab('schema')}
                        className="font-mono text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                      >
                        {asset.schemaRef}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={asset.metadataStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={asset.sharingStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      <div>{asset.rowCount} rows</div>
                      <div className="text-[10px] text-slate-400">{asset.sizeBytes}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {asset.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Inspector Drawer */}
      <Drawer
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        title={selectedAsset ? selectedAsset.name : 'Data Asset Details'}
        subtitle={selectedAsset ? `${selectedAsset.type} · ${selectedAsset.id}` : ''}
        width="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400 font-mono">
              Enforced by SMUS Lake Formation
            </span>
            <button
              onClick={() => setSelectedAsset(null)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
            >
              Close Inspector
            </button>
          </div>
        }
      >
        {selectedAsset && (
          <div className="space-y-6 text-xs">
            {/* Storage URI and Specs */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Storage & Connection URI
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                {selectedAsset.storageLocation}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400">Engine:</span> {selectedAsset.type}
                </div>
                <div>
                  <span className="text-slate-400">Total Rows:</span> {selectedAsset.rowCount}
                </div>
                <div>
                  <span className="text-slate-400">Footprint:</span> {selectedAsset.sizeBytes}
                </div>
              </div>
            </div>

            {/* Partitions */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Partitioning Scheme
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.partitions.map((p, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Applicable Filters */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Applicable Governance Filters ({affectingFilters.length})
              </h4>
              {affectingFilters.length === 0 ? (
                <p className="text-slate-400 text-xs italic">
                  No row-level or column-masking filters currently assigned to this asset.
                </p>
              ) : (
                <div className="space-y-2">
                  {affectingFilters.map((f) => (
                    <div
                      key={f.id}
                      className="p-2.5 border border-slate-200 rounded-lg bg-white flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{f.name}</span>
                        <StatusBadge status={f.status} size="sm" />
                      </div>
                      <div className="font-mono text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {f.configuration}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schema Sample Preview */}
            {matchedSchema && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                    Schema Fields ({matchedSchema.fields.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{matchedSchema.name}</span>
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
                      <tr>
                        <th className="py-2 px-3">Field Name</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">PII</th>
                        <th className="py-2 px-3">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matchedSchema.fields.slice(0, 6).map((f) => (
                        <tr key={f.name}>
                          <td className="py-1.5 px-3 font-mono font-medium text-slate-900">
                            {f.name}
                          </td>
                          <td className="py-1.5 px-2 font-mono text-slate-500">{f.type}</td>
                          <td className="py-1.5 px-2">
                            {f.pii ? (
                              <span className="text-rose-600 font-semibold text-[10px]">PII</span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">No</span>
                            )}
                          </td>
                          <td className="py-1.5 px-3 font-mono text-slate-600 text-[11px] truncate max-w-[150px]">
                            {f.sampleValue || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
