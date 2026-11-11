/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'PRODUCER' | 'CONSUMER' | 'ADMIN';

export type ProjectStatus = 'Active' | 'Draft' | 'Archived' | 'Syncing';
export type SyncStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'NEVER_SYNCED';
export type SensitivityLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type SubscriptionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Revoked';
export type SlaTier = 'Standard (24h)' | 'Silver (4h)' | 'Gold (<15m)' | 'Mission-Critical (<1m)';

export type ExecutionStatus = 'Successful' | 'Running' | 'Failed' | 'Cancelled';
export type ExecutionType = 'Project Sync' | 'Metadata Ingestion' | 'Schema Validation' | 'Access Grant Propagation';

export type AssetType = 
  | 'Apache Iceberg' 
  | 'Parquet (S3)' 
  | 'Amazon Redshift' 
  | 'SMUS Feature Group' 
  | 'AWS Glue Catalog';

export type FilterType = 
  | 'Row-Level Security' 
  | 'Column Masking' 
  | 'Predicate Filter' 
  | 'Time Partition';

export type ProjectMemberRole = 'Project Admin' | 'Project Editor' | 'Project Viewer';

export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  pii: boolean;
  description: string;
  sampleValue?: string;
  constraints?: string;
}

export interface ProjectSchema {
  id: string;
  name: string;
  version: string;
  description: string;
  lastUpdated: string;
  fields: SchemaField[];
  associatedAssets: string[];
  partitionKeys?: string[];
}

export interface DataAsset {
  id: string;
  name: string;
  type: AssetType;
  schemaRef: string;
  storageLocation: string;
  rowCount: string;
  sizeBytes: string;
  sharingStatus: 'Shared' | 'Private' | 'Pending Review';
  metadataStatus: 'Synchronized' | 'Drift Detected' | 'Out of Sync';
  lastUpdated: string;
  description: string;
  partitions: string[];
}

export interface DataFilter {
  id: string;
  name: string;
  assetId: string;
  assetName: string;
  type: FilterType;
  configuration: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
  affectedSchemas: string[];
  description: string;
}

export interface ContractApprovalRequirement {
  role: string;
  approverName: string;
  status: 'Approved' | 'Pending' | 'Waived';
  required: boolean;
  timestamp?: string;
}

export interface DataContract {
  id: string;
  contractNumber: string;
  projectId: string;
  projectName: string;
  participantId: string;
  participantName: string;
  s3SchemaBucket: string;
  schemaVersion: string;
  includedAssets: string[];
  selectedFilters: string[];
  approvals: ContractApprovalRequirement[];
  slaTier: SlaTier;
  complianceClassification: SensitivityLevel;
  contractFingerprint: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'Active' | 'Draft' | 'Pending Review';
  generatedAt: string;
  generatedBy: string;
  termsAndConditions: string;
}

export interface SubscriptionRequest {
  id: string;
  projectId: string;
  projectName: string;
  subscriberName: string;
  subscriberEmail: string;
  subscriberOrg: string;
  participantId: string;
  requestedAssets: string[];
  requestDate: string;
  status: SubscriptionStatus;
  accessLevel: string;
  justification: string;
  slaTier: SlaTier;
  targetSmusWorkspace?: string;
  decidedAt?: string;
  decidedBy?: string;
  rejectionReason?: string;
  connectionEndpoint?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: ProjectMemberRole;
  dateAdded: string;
  status: 'Active' | 'Invited';
}

export interface ExecutionRecord {
  id: string;
  projectId: string;
  projectName: string;
  participantName: string;
  type: ExecutionType;
  startedAt: string;
  completedAt: string;
  duration: string;
  triggeredBy: string;
  status: ExecutionStatus;
  logs: string[];
  errorMessage?: string;
  recordsProcessed?: string;
}

export interface ProjectContactInfo {
  dataStewardName: string;
  dataStewardEmail: string;
  technicalLead: string;
  escalationEmail: string;
  slackChannel: string;
  businessUnit: string;
  officeLocation: string;
  timezone: string;
  supportSla: string;
  generatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  participantId: string;
  participantName: string;
  ownerName: string;
  ownerEmail: string;
  domain: string;
  smusWorkspace: string;
  status: ProjectStatus;
  sensitivity: SensitivityLevel;
  lastSyncedAt: string;
  lastSyncStatus: SyncStatus;
  tags: string[];
  assets: DataAsset[];
  schemas: ProjectSchema[];
  filters: DataFilter[];
  subscriptions: SubscriptionRequest[];
  executions: ExecutionRecord[];
  members: ProjectMember[];
  contactInfo: ProjectContactInfo;
}

export interface Participant {
  id: string;
  name: string;
  code: string;
  description: string;
  region: string;
  projectsCount: number;
  membersCount: number;
  smusClusterId: string;
  status: 'Active' | 'Restricted';
  createdAt: string;
  contactEmail: string;
  assignedProjectAdmins: {
    userId: string;
    userName: string;
    projectId: string;
    projectName: string;
    assignedAt: string;
    assignedBy: string;
  }[];
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  participantId: string;
  participantName: string;
  systemRole: 'DAP Administrator' | 'Data Architect' | 'Data Engineer' | 'Data Analyst' | 'Compliance Officer';
  associatedProjects: { projectId: string; projectName: string; role: string }[];
  status: 'Active' | 'Suspended';
  lastActivity: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  target: string;
  participant: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface ContactGenerationHistoryItem {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  generatedBy: string;
  contactData: ProjectContactInfo;
  exportFormat: 'JSON' | 'vCard' | 'Markdown';
}
