/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { DataContract, ContractApprovalRequirement, SlaTier, SensitivityLevel } from '../../types/dap';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileCheck2,
  CheckCircle2,
  Copy,
  Download,
  Building,
  Shield,
  Layers,
  Database,
  Filter,
  Check,
  Code2,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Lock,
  History,
  FileCode,
  Sliders,
} from 'lucide-react';

export const ContractGenerator: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    contracts,
    generateContract,
    currentParticipant,
  } = useDap();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Project & S3 Schema
  const [s3BucketUri, setS3BucketUri] = useState('s3://smus-dap-fintech-prod/schemas/v2_catalog.json');
  const [isS3Inspected, setIsS3Inspected] = useState(true);
  const [isScanningS3, setIsScanningS3] = useState(false);
  const [selectedAssetNames, setSelectedAssetNames] = useState<string[]>(
    selectedProject ? selectedProject.assets.map((a) => a.name) : []
  );

  // Step 2: Filters to apply
  const [selectedFilterNames, setSelectedFilterNames] = useState<string[]>(
    selectedProject ? selectedProject.filters.map((f) => f.name) : []
  );

  // Step 3: Approvals required
  const [approvals, setApprovals] = useState<ContractApprovalRequirement[]>([
    {
      role: 'Lead Data Steward',
      approverName: selectedProject?.contactInfo.dataStewardName || 'Dr. Elena Rostova',
      status: 'Approved',
      required: true,
      timestamp: '2026-11-10 18:30 UTC',
    },
    {
      role: 'Chief Compliance / Privacy Officer',
      approverName: 'Dr. Arthur Sterling',
      status: 'Approved',
      required: true,
      timestamp: '2026-11-10 19:15 UTC',
    },
    {
      role: 'InfoSec & Cloud Security Lead',
      approverName: 'Devon Miller',
      status: 'Approved',
      required: false,
    },
  ]);

  const [slaTier, setSlaTier] = useState<SlaTier>('Gold (<15m)');
  const [complianceClassification, setComplianceClassification] = useState<SensitivityLevel>('Restricted');
  const [exportFormat, setExportFormat] = useState<'JSON' | 'YAML' | 'Markdown'>('JSON');
  const [copied, setCopied] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<DataContract | null>(null);

  const handleScanS3 = () => {
    setIsScanningS3(true);
    setTimeout(() => {
      setIsScanningS3(false);
      setIsS3Inspected(true);
    }, 800);
  };

  const handleToggleAsset = (name: string) => {
    setSelectedAssetNames((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleToggleFilter = (name: string) => {
    setSelectedFilterNames((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleToggleApprovalRequired = (index: number) => {
    setApprovals((prev) =>
      prev.map((app, i) => (i === index ? { ...app, required: !app.required } : app))
    );
  };

  const handleGenerateContract = () => {
    if (!selectedProject) return;

    const contract = generateContract({
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      participantId: selectedProject.participantId,
      participantName: selectedProject.participantName,
      s3SchemaBucket: s3BucketUri,
      schemaVersion: selectedProject.schemas[0]?.version || 'v2.4.1 (Iceberg Lakehouse)',
      includedAssets: selectedAssetNames,
      selectedFilters: selectedFilterNames,
      approvals,
      slaTier,
      complianceClassification,
      effectiveDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      generatedBy: 'Dr. Elena Rostova',
      termsAndConditions: `Governed under Open Data Sharing Contract (ODSC) 2.4. Strict Lake Formation cell-level filtering enforced. Mandatory cryptographic re-verification upon schema delta event. Data retention period capped at 180 days.`,
    });

    setGeneratedContract(contract);
    setActiveStep(5);
  };

  const getExportString = (contract: DataContract | null) => {
    const c = contract || contracts[0];
    if (!c) return '';

    if (exportFormat === 'JSON') {
      return JSON.stringify(
        {
          $schema: 'https://opendatasharing.org/v2/schema.json',
          contractId: c.contractNumber,
          fingerprint: c.contractFingerprint,
          project: {
            id: c.projectId,
            name: c.projectName,
            ownerParticipant: c.participantName,
          },
          s3Lakehouse: {
            schemaDescriptor: c.s3SchemaBucket,
            engine: 'Apache Iceberg REST Catalog',
            schemaVersion: c.schemaVersion,
            tables: c.includedAssets,
          },
          governancePolicies: {
            classification: c.complianceClassification,
            enforcedFilters: c.selectedFilters,
            slaCommitment: c.slaTier,
          },
          signatories: c.approvals,
          validity: {
            effectiveDate: c.effectiveDate,
            expirationDate: c.expirationDate,
          },
          legalClauses: c.termsAndConditions,
        },
        null,
        2
      );
    } else if (exportFormat === 'YAML') {
      return `odsc_version: "2.4.0"
contract_id: "${c.contractNumber}"
fingerprint: "${c.contractFingerprint}"
project:
  name: "${c.projectName}"
  participant: "${c.participantName}"
lakehouse:
  s3_schema_uri: "${c.s3SchemaBucket}"
  tables:
${c.includedAssets.map((a) => `    - ${a}`).join('\n')}
filters:
${c.selectedFilters.map((f) => `    - ${f}`).join('\n')}
sla: "${c.slaTier}"
classification: "${c.complianceClassification}"
approvals:
${c.approvals.map((a) => `  - role: "${a.role}"\n    approver: "${a.approverName}"\n    status: "${a.status}"`).join('\n')}
effective_date: "${c.effectiveDate}"
expiration_date: "${c.expirationDate}"`;
    } else {
      return `# Data Sharing Contract: ${c.contractNumber}
**Project:** ${c.projectName}
**Participant Producer:** ${c.participantName}
**S3 Schema URI:** \`${c.s3SchemaBucket}\`
**Cryptographic Fingerprint:** \`${c.contractFingerprint}\`

## 1. Included Lakehouse Data Assets
${c.includedAssets.map((a) => `- **Table:** \`${a}\``).join('\n')}

## 2. Enforced Governance Filters
${c.selectedFilters.map((f) => `- **Filter Rule:** \`${f}\``).join('\n')}

## 3. Approval Signatories Matrix
${c.approvals.map((a) => `- **${a.role}:** ${a.approverName} (${a.status})`).join('\n')}

## 4. SLA & Data Classification
- **Service Level Agreement:** ${c.slaTier}
- **Data Sensitivity:** ${c.complianceClassification}
- **Term:** ${c.effectiveDate} through ${c.expirationDate}

## 5. Terms & Compliance
${c.termsAndConditions}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportString(generatedContract));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportString(generatedContract);
    const ext = exportFormat === 'JSON' ? 'json' : exportFormat === 'YAML' ? 'yaml' : 'md';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_contract_${generatedContract?.contractNumber || 'odsc'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Data Sharing Contract Generator
            </h1>
            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              ODSC v2.4 PROTOCOL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal, verifiable data sharing contracts with live S3 schema parsing, governance filters, and multi-party approval workflows
          </p>
        </div>
      </div>

      {/* 5-Step Process Bar with CSS coating */}
      <div className="enterprise-card p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto">
          {[
            { step: 1, label: '1. S3 Lakehouse Schema' },
            { step: 2, label: '2. Enforce Filters' },
            { step: 3, label: '3. Approval Signatories' },
            { step: 4, label: '4. Review Specifications' },
            { step: 5, label: '5. Contract Output' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeStep === s.step
                  ? 'bg-slate-900 text-white shadow-xs'
                  : activeStep > s.step
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Project & Ingest S3 Schema */}
      {activeStep === 1 && (
        <div className="enterprise-card p-6 space-y-5 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              Step 1: Select Data Project & Ingest S3 Lakehouse Schemas
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Connect to AWS S3 bucket and fetch live table schemas and partition manifests
            </p>
          </div>

          {/* Project Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Source Data Project *
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const p = projects.find((proj) => proj.id === e.target.value);
                if (p) setSelectedAssetNames(p.assets.map((a) => a.name));
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) — {p.participantName}
                </option>
              ))}
            </select>
          </div>

          {/* S3 Bucket Schema URI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              S3 Lakehouse Schema Storage Location *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={s3BucketUri}
                onChange={(e) => setS3BucketUri(e.target.value)}
                placeholder="s3://smus-dap-catalog/schemas/master.json"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleScanS3}
                disabled={isScanningS3}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanningS3 ? 'animate-spin' : ''}`} />
                {isScanningS3 ? 'Scanning...' : 'Inspect S3 Schema'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Synchronized with AWS Glue Catalog and Apache Iceberg metadata descriptor.
            </p>
          </div>

          {/* Detected Assets Checklist */}
          {isS3Inspected && selectedProject && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Detected Tables in S3 Manifest ({selectedProject.assets.length})
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-medium">
                  Verified Checksum OK
                </span>
              </div>

              <div className="space-y-2">
                {selectedProject.assets.map((asset) => (
                  <label
                    key={asset.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedAssetNames.includes(asset.name)}
                        onChange={() => handleToggleAsset(asset.name)}
                      />
                      <span className="font-mono font-bold text-slate-900">{asset.name}</span>
                      <span className="text-[11px] text-slate-500">({asset.type})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{asset.rowCount} rows</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Continue to Configure Filters →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Configure Governance & Tenant Filters */}
      {activeStep === 2 && (
        <div className="enterprise-card p-6 space-y-5 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              Step 2: Assign Governance & Tenant-Boundary Filters
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Select which cell-level column masking and third-party isolation filters will be legally bound to this contract
            </p>
          </div>

          <div className="space-y-3">
            {selectedProject?.filters.map((filter) => {
              const isChecked = selectedFilterNames.includes(filter.name);
              return (
                <label
                  key={filter.id}
                  className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleFilter(filter.name)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{filter.name}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {filter.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{filter.description}</p>
                    <div className="mt-2 font-mono text-[10px] bg-slate-950 text-slate-200 p-2 rounded border border-slate-800 select-all">
                      {filter.configuration}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(1)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Schemas
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Continue to Approvals →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Approvals & Signatories */}
      {activeStep === 3 && (
        <div className="enterprise-card p-6 space-y-5 max-w-3xl text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Step 3: Approval Gates & Signatories Matrix
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Specify the multi-party sign-offs required before this contract transitions to ACTIVE in SMUS Lake Formation
            </p>
          </div>

          <div className="space-y-3">
            {approvals.map((app, idx) => (
              <div
                key={idx}
                className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{app.role}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    Designated Signatory: <strong>{app.approverName}</strong>
                  </div>
                  {app.timestamp && (
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Signed: {app.timestamp}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={app.required}
                      onChange={() => handleToggleApprovalRequired(idx)}
                    />
                    Mandatory Sign-off
                  </label>
                  <StatusBadge status={app.status} size="sm" />
                </div>
              </div>
            ))}
          </div>

          {/* SLA & Sensitivity */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contract SLA Commitment Tier
              </label>
              <select
                value={slaTier}
                onChange={(e) => setSlaTier(e.target.value as SlaTier)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="Standard (24h)">Standard (24h SLA)</option>
                <option value="Silver (4h)">Silver (4h SLA)</option>
                <option value="Gold (<15m)">Gold (&lt;15m SLA)</option>
                <option value="Mission-Critical (<1m)">Mission-Critical (&lt;1m Real-Time)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Compliance Classification
              </label>
              <select
                value={complianceClassification}
                onChange={(e) => setComplianceClassification(e.target.value as SensitivityLevel)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
                <option value="Restricted">Restricted (High-Security)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(2)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Filters
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Review Contract Specifications →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review Specifications */}
      {activeStep === 4 && (
        <div className="enterprise-card p-6 space-y-5 max-w-3xl text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Step 4: Review Contract Terms & Legal Bindings
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Verify all stipulations prior to cryptographic contract publication
            </p>
          </div>

          {/* Formatted Contract Card */}
          <div className="enterprise-card-dark text-white p-5 rounded-xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ODSC 2.4 DATA SHARING CONTRACT SPECIFICATION
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedProject?.name}
                </h3>
                <span className="text-xs text-slate-300 font-mono">
                  Tenant: {selectedProject?.participantName}
                </span>
              </div>
              <Lock className="w-8 h-8 text-emerald-400 opacity-80" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">S3 Schema Descriptor</span>
                <span className="font-mono text-white text-[11px] truncate block">
                  {s3BucketUri}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SLA Commitment</span>
                <span className="font-semibold text-white">{slaTier}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Bound Data Tables</span>
                <span className="font-mono text-white">{selectedAssetNames.length} tables selected</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Governance Filters</span>
                <span className="font-mono text-white">{selectedFilterNames.length} rules enforced</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(3)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Edit Approvals
            </button>
            <button
              onClick={handleGenerateContract}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Generate & Publish Contract
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Generated Output */}
      {activeStep === 5 && (
        <div className="enterprise-card p-6 space-y-4 max-w-3xl text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Data Sharing Contract Issued & Certified!
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Contract #{generatedContract?.contractNumber || contracts[0]?.contractNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-[11px] font-semibold">
                {(['JSON', 'YAML', 'Markdown'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      exportFormat === fmt ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download {exportFormat}
              </button>
            </div>
          </div>

          {/* Formatted Code Box */}
          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-[11px] max-h-80 overflow-y-auto border border-slate-800 select-all whitespace-pre leading-relaxed">
            {getExportString(generatedContract)}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Generate Another Contract →
            </button>
          </div>
        </div>
      )}

      {/* Contract Generation Ledger */}
      <div className="enterprise-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Certified Data Contracts Ledger
          </h3>
          <span className="text-xs font-mono text-slate-400">{contracts.length} Registered</span>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-2.5 px-3">Contract Number & ID</th>
                <th className="py-2.5 px-3">Target Project</th>
                <th className="py-2.5 px-3">S3 Schema Location</th>
                <th className="py-2.5 px-3">Filters Enforced</th>
                <th className="py-2.5 px-3">SLA Tier</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Fingerprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900">{c.contractNumber}</span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.generatedAt}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{c.projectName}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600 truncate max-w-[180px]">
                    {c.s3SchemaBucket}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-800">
                    {c.selectedFilters.length} filter(s)
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{c.slaTier}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 text-right truncate max-w-[120px]">
                    {c.contractFingerprint.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
