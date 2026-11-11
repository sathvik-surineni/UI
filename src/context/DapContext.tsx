/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  UserRole,
  Project,
  Participant,
  PlatformUser,
  AuditLogItem,
  ContactGenerationHistoryItem,
  DataContract,
  DataFilter,
  ProjectMember,
  ProjectMemberRole,
  ProjectContactInfo,
  SlaTier,
  ExecutionRecord,
} from '../types/dap';
import {
  INITIAL_PARTICIPANTS,
  INITIAL_PROJECTS,
  INITIAL_PLATFORM_USERS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface DapContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentParticipantId: string;
  setCurrentParticipantId: (id: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  projectActiveTab: string;
  setProjectActiveTab: (tab: string) => void;

  // Selected Discovery Project for Consumer
  discoveryProjectId: string | null;
  setDiscoveryProjectId: (id: string | null) => void;

  // Modals & Panels
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSmusBridgeOpen: boolean;
  setIsSmusBridgeOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Core Data State
  projects: Project[];
  participants: Participant[];
  platformUsers: PlatformUser[];
  auditLogs: AuditLogItem[];
  contactHistory: ContactGenerationHistoryItem[];
  contracts: DataContract[];

  // Active Context Entities
  selectedProject: Project | undefined;
  currentParticipant: Participant | undefined;

  // Operations
  createProject: (data: {
    name: string;
    code: string;
    description: string;
    domain: string;
    sensitivity: Project['sensitivity'];
    smusWorkspace: string;
    tags: string[];
  }) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  approveSubscription: (projectId: string, subId: string, note?: string) => void;
  rejectSubscription: (projectId: string, subId: string, reason: string) => void;
  revokeSubscription: (projectId: string, subId: string) => void;
  requestSubscription: (data: {
    projectId: string;
    requestedAssets: string[];
    justification: string;
    slaTier: SlaTier;
    targetWorkspace: string;
  }) => void;

  addFilter: (projectId: string, filter: Omit<DataFilter, 'id' | 'lastUpdated'>) => void;
  updateFilter: (projectId: string, filterId: string, updates: Partial<DataFilter>) => void;
  deleteFilter: (projectId: string, filterId: string) => void;

  addProjectMember: (projectId: string, member: Omit<ProjectMember, 'id' | 'dateAdded'>) => void;
  removeProjectMember: (projectId: string, memberId: string) => void;
  updateMemberRole: (projectId: string, memberId: string, newRole: ProjectMemberRole) => void;

  isSyncRunning: boolean;
  syncProgress: number;
  syncCurrentStage: string;
  startProjectSync: (projectId: string, syncType: string) => Promise<boolean>;

  generateContact: (projectId: string, contactInfo: ProjectContactInfo, format: 'JSON' | 'vCard' | 'Markdown') => void;
  generateContract: (contractData: Omit<DataContract, 'id' | 'contractNumber' | 'contractFingerprint' | 'generatedAt'>) => DataContract;

  assignProjectAdmin: (participantId: string, projectId: string, userId: string, notes?: string) => void;
  revokeProjectAdmin: (participantId: string, projectId: string, userId: string) => void;

  // Quick navigation helpers
  navigateToProjectWorkspace: (projectId: string, tab?: string) => void;
  navigateToMarketplaceDiscovery: (projectId: string) => void;
}

const DapContext = createContext<DapContextType | undefined>(undefined);

export const DapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<UserRole>('PRODUCER');
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('part-fintech-core');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('dap-proj-001');
  const [activeNav, setActiveNav] = useState<string>('producer-overview');
  const [projectActiveTab, setProjectActiveTab] = useState<string>('overview');
  const [discoveryProjectId, setDiscoveryProjectId] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSmusBridgeOpen, setIsSmusBridgeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Entities
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [contactHistory, setContactHistory] = useState<ContactGenerationHistoryItem[]>([
    {
      id: 'gen-hist-01',
      projectId: 'dap-proj-001',
      projectName: 'Global Anti-Money Laundering & Sanctions Screening',
      generatedAt: '2026-11-09 16:30 UTC',
      generatedBy: 'Dr. Elena Rostova',
      exportFormat: 'JSON',
      contactData: INITIAL_PROJECTS[0].contactInfo,
    },
  ]);

  const [contracts, setContracts] = useState<DataContract[]>([
    {
      id: 'dsc-9001',
      contractNumber: 'ODSC-FINTECH-RISK-2026-08',
      projectId: 'dap-proj-001',
      projectName: 'Global Anti-Money Laundering & Sanctions Screening',
      participantId: 'part-fintech-core',
      participantName: 'FinTech Analytics Core',
      s3SchemaBucket: 's3://smus-dap-fintech-prod/schemas/aml_v2.json',
      schemaVersion: 'v2.4.1 (Iceberg Lakehouse)',
      includedAssets: ['realtime_transaction_scores_v2', 'pep_sanctions_registry_v1'],
      selectedFilters: ['EU_GDPR_Account_Masking_Policy', 'High_Value_Transaction_Partition_Only'],
      approvals: [
        { role: 'Data Steward', approverName: 'Dr. Elena Rostova', status: 'Approved', required: true, timestamp: '2026-11-09 14:20 UTC' },
        { role: 'Chief Compliance Officer', approverName: 'Arthur Sterling', status: 'Approved', required: true, timestamp: '2026-11-09 17:00 UTC' },
        { role: 'InfoSec Lead', approverName: 'Devon Miller', status: 'Approved', required: true, timestamp: '2026-11-09 18:30 UTC' },
      ],
      slaTier: 'Gold (<15m)',
      complianceClassification: 'Restricted',
      contractFingerprint: 'sha256:8f4c28b1a990e1c277f98d01bfa5468903cde81a02fb190d84319a',
      effectiveDate: '2026-11-10',
      expirationDate: '2027-11-10',
      status: 'Active',
      generatedAt: '2026-11-09 18:35 UTC',
      generatedBy: 'Dr. Elena Rostova',
      termsAndConditions: 'Governed by Open Data Sharing Contract (ODSC) 2.0. Cell-level column masking enforced on origin_account_hash. Zero cross-region replication without Lake Formation grant amendment.',
    },
  ]);

  // Sync state
  const [isSyncRunning, setIsSyncRunning] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncCurrentStage, setSyncCurrentStage] = useState('');

  // Toast handler
  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Role Switcher with contextual view setting
  const setCurrentRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'PRODUCER') {
      setActiveNav('producer-overview');
    } else if (newRole === 'CONSUMER') {
      setActiveNav('consumer-overview');
    } else if (newRole === 'ADMIN') {
      setActiveNav('admin-overview');
    }
    showToast('info', `Switched Role to ${newRole === 'PRODUCER' ? 'Data Producer' : newRole === 'CONSUMER' ? 'Data Consumer' : 'DAP Platform Administrator'}`, 'Navigation and permissions updated accordingly.');
  }, [showToast]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  const currentParticipant = useMemo(() => {
    return participants.find((p) => p.id === currentParticipantId) || participants[0];
  }, [participants, currentParticipantId]);

  const addAuditLog = useCallback((action: string, target: string, details: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') => {
    const newEntry: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: currentRole === 'ADMIN' ? 'Alexander Croft (DAP Admin)' : currentRole === 'PRODUCER' ? 'Dr. Elena Rostova (Producer)' : 'Marcus Vance (Consumer)',
      actorEmail: currentRole === 'ADMIN' ? 'alexander.croft@smus-dap.internal' : currentRole === 'PRODUCER' ? 'elena.rostova@fintech-core.aws' : 'marcus.vance@risk-underwriting.aws',
      action,
      target,
      participant: currentParticipant?.name || 'FinTech Analytics Core',
      details,
      ipAddress: '10.24.110.82',
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  }, [currentRole, currentParticipant]);

  const navigateToProjectWorkspace = useCallback((projectId: string, tab = 'overview') => {
    setSelectedProjectId(projectId);
    setProjectActiveTab(tab);
    setActiveNav('producer-workspace');
  }, []);

  const navigateToMarketplaceDiscovery = useCallback((projectId: string) => {
    setDiscoveryProjectId(projectId);
    setActiveNav('consumer-project-detail');
  }, []);

  // CRUD & Operations
  const createProject = useCallback((data: {
    name: string;
    code: string;
    description: string;
    domain: string;
    sensitivity: Project['sensitivity'];
    smusWorkspace: string;
    tags: string[];
  }) => {
    const newProjId = `dap-proj-${String(projects.length + 1).padStart(3, '0')}`;
    const newProj: Project = {
      id: newProjId,
      name: data.name,
      code: data.code.toUpperCase().replace(/\s+/g, '-'),
      description: data.description,
      participantId: currentParticipantId,
      participantName: currentParticipant?.name || 'FinTech Analytics Core',
      ownerName: 'Dr. Elena Rostova',
      ownerEmail: 'elena.rostova@fintech-core.aws',
      domain: data.domain,
      smusWorkspace: data.smusWorkspace,
      status: 'Active',
      sensitivity: data.sensitivity,
      lastSyncedAt: 'Never Synced',
      lastSyncStatus: 'NEVER_SYNCED',
      tags: data.tags.length > 0 ? data.tags : ['Lakehouse', 'SMUS'],
      assets: [],
      schemas: [],
      filters: [],
      subscriptions: [],
      executions: [],
      members: [
        {
          id: `mem-${Date.now()}`,
          name: 'Dr. Elena Rostova',
          email: 'elena.rostova@fintech-core.aws',
          organization: currentParticipant?.name || 'FinTech Analytics Core',
          role: 'Project Admin',
          dateAdded: new Date().toISOString().split('T')[0],
          status: 'Active',
        },
      ],
      contactInfo: {
        dataStewardName: 'Dr. Elena Rostova',
        dataStewardEmail: 'elena.rostova@fintech-core.aws',
        technicalLead: 'Lead Data Engineer',
        escalationEmail: 'escalations@fintech-core.aws',
        slackChannel: '#dap-project-alerts',
        businessUnit: 'Data Platform',
        officeLocation: 'New York (US-East)',
        timezone: 'America/New_York (UTC-5)',
        supportSla: 'Standard Business Hours',
      },
    };

    setProjects((prev) => [newProj, ...prev]);
    // update participant project count
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentParticipantId ? { ...p, projectsCount: p.projectsCount + 1 } : p))
    );

    addAuditLog('PROJECT_CREATED', `${newProjId} (${data.name})`, `Created new project under participant ${currentParticipant?.name}.`);
    showToast('success', 'Project Created', `Project "${data.name}" was successfully registered with DAP.`);
    return newProj;
  }, [projects.length, currentParticipantId, currentParticipant, addAuditLog, showToast]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
    showToast('success', 'Project Updated', 'Project settings were saved successfully.');
    addAuditLog('PROJECT_UPDATED', projectId, `Updated project configuration.`);
  }, [addAuditLog, showToast]);

  const approveSubscription = useCallback((projectId: string, subId: string, note?: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedSubs = proj.subscriptions.map((sub) => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            status: 'Approved' as const,
            decidedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            decidedBy: 'Dr. Elena Rostova',
            connectionEndpoint: `lakehouse.dap.smus.aws.internal:8443/catalog/${proj.id}/read_mirror`,
          };
        });
        return { ...proj, subscriptions: updatedSubs };
      })
    );
    addAuditLog('SUBSCRIPTION_APPROVED', subId, `Approved data access for request ${subId}. ${note ? `Note: ${note}` : ''}`);
    showToast('success', 'Subscription Approved', 'Subscriber has been granted access. SMUS credentials propagated.');
  }, [addAuditLog, showToast]);

  const rejectSubscription = useCallback((projectId: string, subId: string, reason: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedSubs = proj.subscriptions.map((sub) => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            status: 'Rejected' as const,
            decidedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            decidedBy: 'Dr. Elena Rostova',
            rejectionReason: reason,
          };
        });
        return { ...proj, subscriptions: updatedSubs };
      })
    );
    addAuditLog('SUBSCRIPTION_REJECTED', subId, `Rejected subscription request ${subId}. Reason: ${reason}`, 'WARNING');
    showToast('info', 'Subscription Rejected', `Request was rejected: ${reason}`);
  }, [addAuditLog, showToast]);

  const revokeSubscription = useCallback((projectId: string, subId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedSubs = proj.subscriptions.map((sub) => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            status: 'Revoked' as const,
            decidedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          };
        });
        return { ...proj, subscriptions: updatedSubs };
      })
    );
    addAuditLog('SUBSCRIPTION_REVOKED', subId, `Revoked access tokens for subscription ${subId}.`, 'WARNING');
    showToast('info', 'Subscription Revoked', 'Lakehouse data share access revoked.');
  }, [addAuditLog, showToast]);

  const requestSubscription = useCallback((data: {
    projectId: string;
    requestedAssets: string[];
    justification: string;
    slaTier: SlaTier;
    targetWorkspace: string;
  }) => {
    const targetProj = projects.find((p) => p.id === data.projectId);
    if (!targetProj) return;

    const newSubId = `sub-req-${Math.floor(100 + Math.random() * 900)}`;
    const newSub = {
      id: newSubId,
      projectId: targetProj.id,
      projectName: targetProj.name,
      subscriberName: 'Marcus Vance',
      subscriberEmail: 'marcus.vance@risk-underwriting.aws',
      subscriberOrg: 'Risk & Underwriting Labs',
      participantId: 'part-risk-labs',
      requestedAssets: data.requestedAssets,
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      status: 'Pending' as const,
      accessLevel: 'Lakehouse Query & Catalog Replica',
      justification: data.justification,
      slaTier: data.slaTier,
      targetSmusWorkspace: data.targetWorkspace,
    };

    setProjects((prev) =>
      prev.map((proj) => (proj.id === data.projectId ? { ...proj, subscriptions: [newSub, ...proj.subscriptions] } : proj))
    );

    addAuditLog('SUBSCRIPTION_REQUESTED', `${newSubId} on ${targetProj.name}`, `Requested access to ${data.requestedAssets.length} asset(s).`);
    showToast('success', 'Subscription Requested', `Your request (${newSubId}) has been submitted to ${targetProj.ownerName}.`);
  }, [projects, addAuditLog, showToast]);

  const addFilter = useCallback((projectId: string, filter: Omit<DataFilter, 'id' | 'lastUpdated'>) => {
    const newFilter: DataFilter = {
      ...filter,
      id: `filt-${String(Math.floor(10 + Math.random() * 90)).padStart(3, '0')}`,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, filters: [newFilter, ...p.filters] } : p))
    );
    addAuditLog('FILTER_CREATED', newFilter.name, `Added governance filter on ${filter.assetName}.`);
    showToast('success', 'Filter Policy Created', `Filter "${newFilter.name}" is now enforced.`);
  }, [addAuditLog, showToast]);

  const updateFilter = useCallback((projectId: string, filterId: string, updates: Partial<DataFilter>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          filters: p.filters.map((f) => (f.id === filterId ? { ...f, ...updates, lastUpdated: timestamp } : f)),
        };
      })
    );
    addAuditLog('FILTER_UPDATED', filterId, `Modified filter rule configuration.`);
    showToast('success', 'Filter Policy Updated', 'Filter parameters saved and re-propagated.');
  }, [addAuditLog, showToast]);

  const deleteFilter = useCallback((projectId: string, filterId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, filters: p.filters.filter((f) => f.id !== filterId) } : p))
    );
    addAuditLog('FILTER_DELETED', filterId, `Removed data filter policy.`);
    showToast('info', 'Filter Removed', 'Filter policy was deleted.');
  }, [addAuditLog, showToast]);

  const addProjectMember = useCallback((projectId: string, member: Omit<ProjectMember, 'id' | 'dateAdded'>) => {
    const newMem: ProjectMember = {
      ...member,
      id: `mem-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, members: [...p.members, newMem] } : p))
    );
    addAuditLog('MEMBER_ADDED', member.name, `Added ${member.name} (${member.role}) to project.`);
    showToast('success', 'Member Added', `${member.name} assigned as ${member.role}.`);
  }, [addAuditLog, showToast]);

  const removeProjectMember = useCallback((projectId: string, memberId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, members: p.members.filter((m) => m.id !== memberId) } : p))
    );
    addAuditLog('MEMBER_REMOVED', memberId, `Revoked project membership.`);
    showToast('info', 'Member Removed', 'User access to project revoked.');
  }, [addAuditLog, showToast]);

  const updateMemberRole = useCallback((projectId: string, memberId: string, newRole: ProjectMemberRole) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          members: p.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
        };
      })
    );
    addAuditLog('MEMBER_ROLE_UPDATED', memberId, `Updated role to ${newRole}.`);
    showToast('success', 'Role Updated', `Project permissions updated to ${newRole}.`);
  }, [addAuditLog, showToast]);

  // Project Sync Simulation
  const startProjectSync = useCallback(async (projectId: string, syncType: string): Promise<boolean> => {
    if (isSyncRunning) return false;
    setIsSyncRunning(true);
    setSyncProgress(10);
    setSyncCurrentStage('Connecting to SMUS metadata cluster...');

    const target = projects.find((p) => p.id === projectId);
    const projName = target?.name || projectId;

    await new Promise((r) => setTimeout(r, 600));
    setSyncProgress(35);
    setSyncCurrentStage('Inspecting Apache Iceberg & Redshift table schemas...');

    await new Promise((r) => setTimeout(r, 700));
    setSyncProgress(60);
    setSyncCurrentStage('Evaluating data filters & column masking constraints...');

    await new Promise((r) => setTimeout(r, 800));
    setSyncProgress(85);
    setSyncCurrentStage('Publishing catalog delta to DAP sharing mesh...');

    await new Promise((r) => setTimeout(r, 600));
    setSyncProgress(100);
    setSyncCurrentStage('Synchronization complete. Verified zero schema drift.');

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const newExec: ExecutionRecord = {
      id: `exec-${Math.floor(10000 + Math.random() * 90000)}`,
      projectId,
      projectName: projName,
      participantName: target?.participantName || 'FinTech Analytics Core',
      type: 'Project Sync',
      startedAt: timestamp,
      completedAt: timestamp,
      duration: '2m 14s',
      triggeredBy: 'Manual Trigger (Dr. Elena Rostova)',
      status: 'Successful',
      recordsProcessed: '148,290,000',
      logs: [
        `[${timestamp.substring(11, 19)}] Authenticated with SMUS endpoint.`,
        `[${timestamp.substring(11, 19)}] Synchronized schemas for ${target?.assets.length || 0} assets.`,
        `[${timestamp.substring(11, 19)}] Verified compliance filters and column security rules.`,
        `[${timestamp.substring(11, 19)}] Catalog broadcast complete. Delta checksum OK.`,
      ],
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          lastSyncedAt: timestamp,
          lastSyncStatus: 'SUCCESS',
          executions: [newExec, ...p.executions],
        };
      })
    );

    setIsSyncRunning(false);
    addAuditLog('PROJECT_SYNC_COMPLETED', projName, `Executed ${syncType} sync. Synchronized all data assets with zero drift.`);
    showToast('success', 'Project Sync Complete', `All assets and schemas for "${projName}" are synchronized.`);
    return true;
  }, [isSyncRunning, projects, addAuditLog, showToast]);

  const generateContact = useCallback((projectId: string, contactInfo: ProjectContactInfo, format: 'JSON' | 'vCard' | 'Markdown') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    const updatedContact = { ...contactInfo, generatedAt: timestamp };

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, contactInfo: updatedContact } : p))
    );

    const target = projects.find((p) => p.id === projectId);
    const histItem: ContactGenerationHistoryItem = {
      id: `gen-hist-${Date.now()}`,
      projectId,
      projectName: target?.name || projectId,
      generatedAt: timestamp,
      generatedBy: 'Dr. Elena Rostova',
      contactData: updatedContact,
      exportFormat: format,
    };

    setContactHistory((prev) => [histItem, ...prev]);
    addAuditLog('CONTACT_GENERATED', target?.name || projectId, `Generated contact descriptor in ${format} format.`);
    showToast('success', 'Contact Generated', `Governance contact information generated and registered.`);
  }, [projects, addAuditLog, showToast]);

  const generateContract = useCallback((contractData: Omit<DataContract, 'id' | 'contractNumber' | 'contractFingerprint' | 'generatedAt'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const contractNumber = `ODSC-${contractData.projectName.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newContract: DataContract = {
      ...contractData,
      id: `dsc-${Date.now()}`,
      contractNumber,
      contractFingerprint: `sha256:${randomHex}${randomHex}`,
      generatedAt: timestamp,
    };

    setContracts((prev) => [newContract, ...prev]);
    addAuditLog('CONTRACT_GENERATED', `${contractNumber} (${contractData.projectName})`, `Generated Data Sharing Contract with ${contractData.selectedFilters.length} filters and ${contractData.approvals.length} approvals.`);
    showToast('success', 'Data Contract Generated', `Contract "${contractNumber}" published to DAP Lake Formation mesh.`);
    return newContract;
  }, [addAuditLog, showToast]);

  const assignProjectAdmin = useCallback((participantId: string, projectId: string, userId: string, notes?: string) => {
    const user = platformUsers.find((u) => u.id === userId);
    const proj = projects.find((p) => p.id === projectId);

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p;
        const exists = p.assignedProjectAdmins.some((a) => a.userId === userId && a.projectId === projectId);
        if (exists) return p;
        return {
          ...p,
          assignedProjectAdmins: [
            ...p.assignedProjectAdmins,
            {
              userId,
              userName: user?.name || userId,
              projectId,
              projectName: proj?.name || projectId,
              assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
              assignedBy: 'Alexander Croft (DAP Admin)',
            },
          ],
        };
      })
    );

    // also add or update user in project members if not already
    if (proj && user) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const memberExists = p.members.some((m) => m.email === user.email);
          if (memberExists) {
            return {
              ...p,
              members: p.members.map((m) => (m.email === user.email ? { ...m, role: 'Project Admin' } : m)),
            };
          }
          return {
            ...p,
            members: [
              ...p.members,
              {
                id: `mem-${Date.now()}`,
                name: user.name,
                email: user.email,
                organization: user.participantName,
                role: 'Project Admin',
                dateAdded: new Date().toISOString().split('T')[0],
                status: 'Active',
              },
            ],
          };
        })
      );
    }

    addAuditLog('PROJECT_ADMIN_ASSIGNED', `${user?.name || userId} -> ${proj?.name || projectId}`, `DAP Admin granted Project Admin rights. ${notes || ''}`, 'WARNING');
    showToast('success', 'Project Admin Assigned', `${user?.name} is now a designated Project Administrator for ${proj?.name}.`);
  }, [platformUsers, projects, addAuditLog, showToast]);

  const revokeProjectAdmin = useCallback((participantId: string, projectId: string, userId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p;
        return {
          ...p,
          assignedProjectAdmins: p.assignedProjectAdmins.filter(
            (a) => !(a.userId === userId && a.projectId === projectId)
          ),
        };
      })
    );

    addAuditLog('PROJECT_ADMIN_REVOKED', `${userId} from ${projectId}`, `DAP Admin revoked Project Administrator privileges.`, 'WARNING');
    showToast('info', 'Project Admin Revoked', 'Administrator privilege revoked.');
  }, [addAuditLog, showToast]);

  return (
    <DapContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentParticipantId,
        setCurrentParticipantId,
        selectedProjectId,
        setSelectedProjectId,
        activeNav,
        setActiveNav,
        projectActiveTab,
        setProjectActiveTab,
        discoveryProjectId,
        setDiscoveryProjectId,
        isSearchOpen,
        setIsSearchOpen,
        isSmusBridgeOpen,
        setIsSmusBridgeOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        toasts,
        showToast,
        removeToast,
        projects,
        participants,
        platformUsers,
        auditLogs,
        contactHistory,
        contracts,
        selectedProject,
        currentParticipant,
        createProject,
        updateProject,
        approveSubscription,
        rejectSubscription,
        revokeSubscription,
        requestSubscription,
        addFilter,
        updateFilter,
        deleteFilter,
        addProjectMember,
        removeProjectMember,
        updateMemberRole,
        isSyncRunning,
        syncProgress,
        syncCurrentStage,
        startProjectSync,
        generateContact,
        generateContract,
        assignProjectAdmin,
        revokeProjectAdmin,
        navigateToProjectWorkspace,
        navigateToMarketplaceDiscovery,
      }}
    >
      {children}
    </DapContext.Provider>
  );
};

export const useDap = () => {
  const context = useContext(DapContext);
  if (!context) {
    throw new Error('useDap must be used within a DapProvider');
  }
  return context;
};
