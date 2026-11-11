/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDap } from '../../context/DapContext';
import { ProjectContactInfo } from '../../types/dap';
import {
  FileText,
  CheckCircle2,
  Copy,
  Download,
  Building,
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Shield,
  History,
  Check,
} from 'lucide-react';

export const ContactGenerator: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    generateContact,
    contactHistory,
  } = useDap();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const initialContact = selectedProject?.contactInfo || {
    dataStewardName: 'Dr. Elena Rostova',
    dataStewardEmail: 'elena.rostova@fintech-core.aws',
    technicalLead: 'David Chen (Staff Data Architect)',
    escalationEmail: 'aml-dap-escalations@fintech-core.aws',
    slackChannel: '#dap-aml-governance',
    businessUnit: 'Global Financial Crime & Risk Analytics',
    officeLocation: 'New York (US-East)',
    timezone: 'America/New_York (UTC-5)',
    supportSla: '4-hour initial triage on high-severity sync alerts',
  };

  const [contactData, setContactData] = useState<ProjectContactInfo>(initialContact);
  const [exportFormat, setExportFormat] = useState<'JSON' | 'vCard' | 'Markdown'>('JSON');
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    const p = projects.find((proj) => proj.id === id);
    if (p) {
      setContactData(p.contactInfo);
    }
  };

  const handleGenerate = () => {
    if (!selectedProject) return;
    generateContact(selectedProject.id, contactData, exportFormat);
    setIsGenerated(true);
    setActiveStep(4);
  };

  const getExportString = () => {
    if (exportFormat === 'JSON') {
      return JSON.stringify(
        {
          dapProject: selectedProject?.name,
          projectCode: selectedProject?.code,
          contactInfo: contactData,
          generatedAt: new Date().toISOString(),
          federationStandard: 'SMUS-DAP-GOV-v3.2',
        },
        null,
        2
      );
    } else if (exportFormat === 'vCard') {
      return `BEGIN:VCARD
VERSION:3.0
FN:${contactData.dataStewardName} (DAP Steward)
EMAIL:${contactData.dataStewardEmail}
ORG:${selectedProject?.participantName}
TITLE:Data Governance Steward - ${selectedProject?.name}
NOTE:Technical Lead: ${contactData.technicalLead} | Slack: ${contactData.slackChannel} | SLA: ${contactData.supportSla}
END:VCARD`;
    } else {
      return `# Data Steward Governance Contact Card
**Project:** ${selectedProject?.name} (${selectedProject?.code})
**Participant Organization:** ${selectedProject?.participantName}

- **Primary Data Steward:** ${contactData.dataStewardName} (${contactData.dataStewardEmail})
- **Technical Architect Lead:** ${contactData.technicalLead}
- **Escalation Incident Desk:** ${contactData.escalationEmail}
- **Slack / Teams Channel:** \`${contactData.slackChannel}\`
- **Business Unit:** ${contactData.businessUnit}
- **Support SLA:** ${contactData.supportSla}
- **Operating Timezone:** ${contactData.timezone}
- **Facility / Region:** ${contactData.officeLocation}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportString();
    const ext = exportFormat === 'JSON' ? 'json' : exportFormat === 'vCard' ? 'vcf' : 'md';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dap_contact_${selectedProject?.code || 'project'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Contact Generator</h1>
        <p className="text-xs text-slate-500 mt-1">
          Create standardized enterprise data stewardship contact cards and metadata headers for DAP catalog registration
        </p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { step: 1, label: 'Select Project' },
            { step: 2, label: 'Configure Details' },
            { step: 3, label: 'Review Contact' },
            { step: 4, label: 'Generate & Export' },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(s.step as any)}
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                  activeStep === s.step
                    ? 'bg-slate-900 text-white shadow-xs'
                    : activeStep > s.step
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {activeStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
              </button>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  activeStep === s.step ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Project */}
      {activeStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 max-w-3xl">
          <h2 className="text-sm font-semibold text-slate-900">Step 1: Choose Target Project</h2>
          <p className="text-xs text-slate-500">
            Select the project you wish to generate or update contact metadata for:
          </p>

          <div className="space-y-2">
            {projects.map((proj) => (
              <label
                key={proj.id}
                className={`p-3.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  selectedProjectId === proj.id
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="project"
                    checked={selectedProjectId === proj.id}
                    onChange={() => handleProjectSelect(proj.id)}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{proj.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {proj.code} · {proj.participantName}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{proj.assets.length} assets</span>
              </label>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Continue to Configure →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure Contact Details */}
      {activeStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 max-w-3xl text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Step 2: Configure Governance Contacts
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">
                For project: <strong>{selectedProject?.name}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data Steward Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactData.dataStewardName}
                onChange={(e) =>
                  setContactData({ ...contactData, dataStewardName: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data Steward Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={contactData.dataStewardEmail}
                onChange={(e) =>
                  setContactData({ ...contactData, dataStewardEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Staff Technical Lead <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactData.technicalLead}
                onChange={(e) =>
                  setContactData({ ...contactData, technicalLead: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Escalation Incident Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={contactData.escalationEmail}
                onChange={(e) =>
                  setContactData({ ...contactData, escalationEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Slack / Teams Governance Channel
              </label>
              <input
                type="text"
                value={contactData.slackChannel}
                onChange={(e) =>
                  setContactData({ ...contactData, slackChannel: e.target.value })
                }
                placeholder="#dap-governance"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Support SLA Commitment
              </label>
              <input
                type="text"
                value={contactData.supportSla}
                onChange={(e) => setContactData({ ...contactData, supportSla: e.target.value })}
                placeholder="e.g. 4-hour response on Severity-1 incident"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Business Unit</label>
              <input
                type="text"
                value={contactData.businessUnit}
                onChange={(e) =>
                  setContactData({ ...contactData, businessUnit: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Operating Timezone & Region
              </label>
              <input
                type="text"
                value={contactData.timezone}
                onChange={(e) => setContactData({ ...contactData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(1)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Project Selection
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Review Contact Card →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review Contact Card */}
      {activeStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 max-w-3xl text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Step 3: Review Generated Contact Profile
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Verify how your contact details will appear to data consumers and DAP platform auditors
            </p>
          </div>

          {/* Formatted Card Preview */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  DAP CERTIFIED STEWARD CARD
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {contactData.dataStewardName}
                </h3>
                <span className="text-xs text-slate-300 font-mono">
                  {contactData.dataStewardEmail}
                </span>
              </div>
              <Shield className="w-8 h-8 text-emerald-400 opacity-80" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Project</span>
                <span className="font-semibold text-white">{selectedProject?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Business Unit</span>
                <span className="text-white">{contactData.businessUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Technical Lead</span>
                <span className="text-white">{contactData.technicalLead}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Escalations Desk</span>
                <span className="font-mono text-white">{contactData.escalationEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Slack / Teams</span>
                <span className="font-mono text-white">{contactData.slackChannel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SLA SLA</span>
                <span className="text-white">{contactData.supportSla}</span>
              </div>
            </div>
          </div>

          {/* Export Format Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-900 block">Select Generation Format</label>
            <div className="flex items-center gap-3">
              {(['JSON', 'vCard', 'Markdown'] as const).map((fmt) => (
                <label
                  key={fmt}
                  className={`px-4 py-2 rounded-lg border cursor-pointer font-medium text-xs flex items-center gap-2 ${
                    exportFormat === fmt
                      ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fmt"
                    checked={exportFormat === fmt}
                    onChange={() => setExportFormat(fmt)}
                  />
                  <span>{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(2)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Edit Details
            </button>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Generate & Publish Contact
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Display Result & Export */}
      {activeStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 max-w-3xl text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Contact Successfully Generated!
                </h3>
                <p className="text-[11px] text-slate-500">
                  Published to DAP metadata registry for {selectedProject?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download {exportFormat}
              </button>
            </div>
          </div>

          {/* Formatted Code Block */}
          <div className="bg-slate-950 text-slate-200 rounded-lg p-4 font-mono text-[11px] max-h-72 overflow-y-auto border border-slate-800 select-all whitespace-pre">
            {getExportString()}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setActiveStep(2)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reconfigure Contact
            </button>
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs font-semibold text-slate-900 hover:underline"
            >
              Generate for Another Project →
            </button>
          </div>
        </div>
      )}

      {/* Generation History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          Previous Contact Generation History
        </h3>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-600">
              <tr>
                <th className="py-2 px-3">Project</th>
                <th className="py-2 px-3">Steward</th>
                <th className="py-2 px-3">Generated At</th>
                <th className="py-2 px-3">Format</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contactHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {item.projectName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {item.contactData.dataStewardName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{item.generatedAt}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">{item.exportFormat}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        handleProjectSelect(item.projectId);
                        setContactData(item.contactData);
                        setActiveStep(3);
                      }}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Load & Re-export
                    </button>
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
