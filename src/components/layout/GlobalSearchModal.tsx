/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useDap } from '../../context/DapContext';
import { Search, FolderGit2, Database, Code, Users, ArrowRight, X } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    projects,
    participants,
    navigateToProjectWorkspace,
    navigateToMarketplaceDiscovery,
    currentRole,
    setActiveNav,
  } = useDap();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        projects: projects.slice(0, 3),
        assets: projects.flatMap((p) => p.assets.map((a) => ({ ...a, project: p }))).slice(0, 3),
        schemas: projects.flatMap((p) => p.schemas.map((s) => ({ ...s, project: p }))).slice(0, 2),
      };
    }

    const q = query.toLowerCase();

    const matchedProjects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.participantName.toLowerCase().includes(q)
    );

    const matchedAssets = projects
      .flatMap((p) => p.assets.map((a) => ({ ...a, project: p })))
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );

    const matchedSchemas = projects
      .flatMap((p) => p.schemas.map((s) => ({ ...s, project: p })))
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.fields.some((f) => f.name.toLowerCase().includes(q))
      );

    return {
      projects: matchedProjects,
      assets: matchedAssets,
      schemas: matchedSchemas,
    };
  }, [query, projects]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, schemas, data assets, and participant catalog..."
            autoFocus
            className="w-full text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Projects */}
          {searchResults.projects.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Projects ({searchResults.projects.length})</span>
              </div>
              <div className="space-y-1">
                {searchResults.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (currentRole === 'CONSUMER') {
                        navigateToMarketplaceDiscovery(p.id);
                      } else {
                        navigateToProjectWorkspace(p.id, 'overview');
                      }
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-slate-900 border border-slate-200">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {p.code} · {p.participantName}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Data Assets */}
          {searchResults.assets.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Data Assets ({searchResults.assets.length})
              </div>
              <div className="space-y-1">
                {searchResults.assets.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToProjectWorkspace(a.project.id, 'assets');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-slate-900 border border-slate-200">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 font-mono truncate">{a.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {a.type} · {a.project.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{a.rowCount} rows</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Schemas */}
          {searchResults.schemas.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Schemas ({searchResults.schemas.length})
              </div>
              <div className="space-y-1">
                {searchResults.schemas.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToProjectWorkspace(s.project.id, 'schema');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-slate-900 border border-slate-200">
                        <Code className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 font-mono truncate">{s.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {s.version} · {s.fields.length} fields · {s.project.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.projects.length === 0 &&
            searchResults.assets.length === 0 &&
            searchResults.schemas.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                <p className="font-medium text-slate-700">No matching DAP resources found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for "AML", "Iceberg", "sanctions", or "LTV"
                </p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search index includes all Lake Formation & Glue Catalog federated entries</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
