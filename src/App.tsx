/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DapProvider, useDap } from './context/DapContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { SmusBridgeModal } from './components/layout/SmusBridgeModal';
import { ToastContainer } from './components/common/Toast';

// Producer & Participant Views
import { ParticipantDashboard } from './components/producer/ParticipantDashboard';
import { ProjectsList } from './components/producer/ProjectsList';
import { ProjectWorkspace } from './components/producer/ProjectWorkspace';
import { ContractGenerator } from './components/producer/ContractGenerator';

// Consumer Views
import { ConsumerDashboard } from './components/consumer/ConsumerDashboard';
import { DataMarketplace } from './components/consumer/DataMarketplace';
import { ProjectDiscoveryDetails } from './components/consumer/ProjectDiscoveryDetails';
import { MySubscriptions } from './components/consumer/MySubscriptions';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ParticipantManagement } from './components/admin/ParticipantManagement';
import { GlobalProjects } from './components/admin/GlobalProjects';
import { ProjectAdminAccess } from './components/admin/ProjectAdminAccess';
import { GlobalExecutionMonitoring } from './components/admin/GlobalExecutionMonitoring';
import { PlatformMembers } from './components/admin/PlatformMembers';
import { AuditLogViewer } from './components/admin/AuditLogViewer';

const AppContent: React.FC = () => {
  const { activeNav } = useDap();

  const renderActiveView = () => {
    switch (activeNav) {
      // Participant / Producer
      case 'producer-overview':
      case 'participant-overview':
        return <ParticipantDashboard />;
      case 'producer-projects':
        return <ProjectsList />;
      case 'producer-workspace':
        return <ProjectWorkspace />;
      case 'producer-contact-generator':
      case 'contract-generator':
        return <ContractGenerator />;

      // Consumer
      case 'consumer-overview':
        return <ConsumerDashboard />;
      case 'consumer-marketplace':
        return <DataMarketplace />;
      case 'consumer-project-detail':
        return <ProjectDiscoveryDetails />;
      case 'consumer-subscriptions':
        return <MySubscriptions />;

      // Admin
      case 'admin-overview':
        return <AdminDashboard />;
      case 'admin-participants':
        return <ParticipantManagement />;
      case 'admin-projects':
        return <GlobalProjects />;
      case 'admin-access':
        return <ProjectAdminAccess />;
      case 'admin-executions':
        return <GlobalExecutionMonitoring />;
      case 'admin-members':
        return <PlatformMembers />;
      case 'admin-audit':
        return <AuditLogViewer />;

      default:
        return <ParticipantDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <NotificationsDrawer />
      <SmusBridgeModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DapProvider>
      <AppContent />
    </DapProvider>
  );
}
