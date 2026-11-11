/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../../context/DapContext';
import { ProjectSchema } from '../../../types/dap';
import {
  Code,
  Layers,
  ChevronDown,
  ChevronRight,
  Database,
  Shield,
  Tag,
  Key,
  Info,
  ExternalLink,
} from 'lucide-react';

export const TabSchemaMetadata: React.FC = () => {
  const { selectedProject } = useDap();
  const [expandedSchemaId, setExpandedSchemaId] = useState<string | null>(
    selectedProject?.schemas[0]?.id || null
  );

  if (!selectedProject) return null;

  const toggleSchema = (id: string) => {
    setExpandedSchemaId(expandedSchemaId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Project Schemas & Lakehouse Metadata Contracts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Governed schema definitions synchronized with AWS Glue Catalog and Apache Iceberg metadata
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded border border-slate-200">
          {selectedProject.schemas.length} Registered Schemas
        </div>
      </div>

      {/* Schema Accordion Cards */}
      <div className="space-y-4">
        {selectedProject.schemas.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed rounded-lg text-xs text-slate-400">
            No schemas currently registered for this project.
          </div>
        ) : (
          selectedProject.schemas.map((schema) => {
            const isExpanded = expandedSchemaId === schema.id;
            const piiCount = schema.fields.filter((f) => f.pii).length;

            return (
              <div
                key={schema.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
              >
                {/* Header */}
                <div
                  onClick={() => toggleSchema(schema.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button className="text-slate-400 hover:text-slate-600">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-1.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Code className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 font-mono text-xs truncate">
                          {schema.name}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                          {schema.version}
                        </span>
                        {piiCount > 0 && (
                          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {piiCount} PII Fields
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {schema.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="hidden sm:inline">{schema.fields.length} attributes</span>
                    <span className="text-slate-400">Updated {schema.lastUpdated}</span>
                  </div>
                </div>

                {/* Expanded Schema Table */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/30 p-4 space-y-4">
                    {/* Associated Assets & Partitions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">Associated Asset:</span>
                        <span className="font-mono font-medium text-slate-800">
                          {schema.associatedAssets.join(', ') || 'None'}
                        </span>
                      </div>

                      {schema.partitionKeys && schema.partitionKeys.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Partition Columns:</span>
                          <span className="font-mono text-slate-800">
                            {schema.partitionKeys.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Fields Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
                          <tr>
                            <th className="py-2.5 px-4">Field / Column</th>
                            <th className="py-2.5 px-3">Data Type</th>
                            <th className="py-2.5 px-3">Nullable</th>
                            <th className="py-2.5 px-3">PII / Masking</th>
                            <th className="py-2.5 px-4">Business Description</th>
                            <th className="py-2.5 px-4">Sample Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {schema.fields.map((f, i) => (
                            <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">
                                {f.name}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-indigo-700 font-medium text-[11px]">
                                {f.type}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">
                                {f.nullable ? (
                                  <span className="text-slate-500">YES</span>
                                ) : (
                                  <span className="text-slate-800 font-semibold">NOT NULL</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                {f.pii ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                    <Shield className="w-3 h-3" /> PII
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-slate-600 max-w-xs leading-relaxed">
                                {f.description}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 bg-slate-50/50 truncate max-w-[180px]">
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
            );
          })
        )}
      </div>
    </div>
  );
};
