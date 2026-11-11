/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDap } from '../../context/DapContext';
import { ChevronRight, Database } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const { currentRole, activeNav, selectedProject, setActiveNav, setProjectActiveTab, projectActiveTab } = useDap();

  const getBreadcrumbs = () => {
    const items: { label: string; onClick?: () => void }[] = [];

    if (currentRole === 'PRODUCER' || currentRole === 'CONSUMER') {
      items.push({
        label: 'Participant Console',
        onClick: () => setActiveNav('producer-overview'),
      });

      if (activeNav === 'producer-overview' || activeNav === 'participant-overview') {
        items.push({ label: 'Participant Dashboard' });
      } else if (activeNav === 'producer-projects') {
        items.push({ label: 'Projects Directory' });
      } else if (activeNav === 'producer-workspace') {
        items.push({
          label: selectedProject ? selectedProject.name : 'Project Workspace',
          onClick: () => setActiveNav('producer-workspace'),
        });
        const tabLabels: Record<string, string> = {
          overview: 'Overview',
          assets: 'Data Assets',
          schema: 'Schema & Metadata',
          filters: 'Filters Management',
          subscriptions: 'Subscription Approvals',
          sync: 'Project Sync',
          executions: 'Execution History',
          members: 'Project Members',
          settings: 'Settings',
        };
        items.push({ label: tabLabels[projectActiveTab] || 'Workspace' });
      } else if (activeNav === 'producer-contact-generator' || activeNav === 'contract-generator') {
        items.push({ label: 'Contract Generator' });
      } else if (activeNav === 'consumer-marketplace') {
        items.push({ label: 'Data Marketplace' });
      } else if (activeNav === 'consumer-subscriptions') {
        items.push({ label: 'My Subscriptions' });
      } else if (activeNav === 'consumer-project-detail') {
        items.push({ label: 'Marketplace', onClick: () => setActiveNav('consumer-marketplace') });
        items.push({ label: 'Project Discovery Details' });
      }
    } else if (currentRole === 'ADMIN') {
      items.push({
        label: 'Data Consumer',
        onClick: () => setActiveNav('consumer-overview'),
      });

      if (activeNav === 'consumer-overview') {
        items.push({ label: 'Discovery Overview' });
      } else if (activeNav === 'consumer-marketplace') {
        items.push({ label: 'Data Marketplace' });
      } else if (activeNav === 'consumer-project-detail') {
        items.push({
          label: 'Marketplace',
          onClick: () => setActiveNav('consumer-marketplace'),
        });
        items.push({ label: 'Project Discovery Details' });
      } else if (activeNav === 'consumer-subscriptions') {
        items.push({ label: 'My Subscriptions' });
      }
    } else if (currentRole === 'ADMIN') {
      items.push({
        label: 'DAP Administration',
        onClick: () => setActiveNav('admin-overview'),
      });

      const adminLabels: Record<string, string> = {
        'admin-overview': 'Platform Analytics',
        'admin-participants': 'Participant Management',
        'admin-projects': 'Global Projects',
        'admin-access': 'Project Admin Access',
        'admin-executions': 'Global Execution Monitoring',
        'admin-members': 'Platform Members',
        'admin-audit': 'Audit & Activity Log',
      };
      items.push({ label: adminLabels[activeNav] || 'Admin Console' });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            {item.onClick && !isLast ? (
              <button
                onClick={item.onClick}
                className="hover:text-slate-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </button>
            ) : (
              <span className={`truncate max-w-[260px] ${isLast ? 'text-slate-900 font-semibold' : ''}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
