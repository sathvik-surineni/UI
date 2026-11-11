/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useDap } from '../../context/DapContext';
import { Breadcrumbs } from './Breadcrumbs';
import { UserRole } from '../../types/dap';
import {
  Search,
  Bell,
  HelpCircle,
  Building2,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
  LogOut,
  User,
  Sliders,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentParticipantId,
    setCurrentParticipantId,
    participants,
    currentParticipant,
    setIsSearchOpen,
    setIsSmusBridgeOpen,
    setIsNotificationsOpen,
    auditLogs,
  } = useDap();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const orgMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target as Node)) {
        setIsOrgMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: UserRole; title: string; desc: string; icon: typeof Layers }[] = [
    {
      id: 'PRODUCER',
      title: 'Data Producer',
      desc: 'Project Owner, Schema Publisher & Sync',
      icon: Layers,
    },
    {
      id: 'CONSUMER',
      title: 'Data Consumer',
      desc: 'Marketplace Explorer & Subscriber',
      icon: Sparkles,
    },
    {
      id: 'ADMIN',
      title: 'DAP Platform Admin',
      desc: 'Governance, Tenant & Access Ops',
      icon: Shield,
    },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <header className="h-14 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center justify-between px-6 select-none">
      {/* Left: Brand + Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs">
            DAP
          </div>
          <div className="leading-tight">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              SMUS Data Sharing
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              v3.2 SMUS
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden md:block" />

        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs transition-colors"
          title="Search assets, projects, schemas (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search platform...</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Organization / Participant Selector */}
        <div className="relative" ref={orgMenuRef}>
          <button
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 bg-white transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[130px] truncate">
              {currentParticipant?.name || 'FinTech Analytics'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isOrgMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Participant
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {participants.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => {
                      setCurrentParticipantId(part.id);
                      setIsOrgMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 transition-colors ${
                      part.id === currentParticipantId
                        ? 'bg-slate-50 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{part.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {part.code} · {part.region.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              currentRole === 'ADMIN'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : currentRole === 'CONSUMER'
                ? 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <currentRoleObj.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentRoleObj.title}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Switch Role Persona</span>
                <span className="text-[10px] text-slate-400">RBAC Enabled</span>
              </div>
              <div className="p-1 space-y-1">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isCurrent = role.id === currentRole;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setCurrentRole(role.id);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-md flex items-start gap-2.5 transition-colors ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-900 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          {role.title}
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-600 font-normal">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{role.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SMUS Architecture & Docs button */}
        <button
          onClick={() => setIsSmusBridgeOpen(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="SMUS Architecture & Lake Formation Integration"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications trigger */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          title="Recent Activity & Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xs border border-slate-300">
              {currentRole === 'ADMIN' ? 'AC' : currentRole === 'CONSUMER' ? 'MV' : 'ER'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">
                  {currentRole === 'ADMIN'
                    ? 'Alexander Croft'
                    : currentRole === 'CONSUMER'
                    ? 'Marcus Vance'
                    : 'Dr. Elena Rostova'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentRole === 'ADMIN'
                    ? 'alexander.croft@smus-dap.internal'
                    : currentRole === 'CONSUMER'
                    ? 'marcus.vance@risk-underwriting.aws'
                    : 'elena.rostova@fintech-core.aws'}
                </div>
                <div className="mt-1 text-[10px] font-mono text-slate-400">
                  Tenant: {currentParticipant?.name}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsSmusBridgeOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  SMUS Cluster Config
                </button>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  Audit & Logs ({auditLogs.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
