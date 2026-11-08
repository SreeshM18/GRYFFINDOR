import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Shield, Check, Lock, Globe } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { DocumentItem, UserId } from '../../types/workOs';

export const DocumentsPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserId | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [documents, setDocuments] = useState<DocumentItem[]>(workOs.getDocuments());
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const filtered = documents.filter((doc) => {
    const matchesUser = selectedUser === 'all' || doc.ownerId === selectedUser || doc.ownerId === 'shared';
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesUser && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'resume', label: 'Resumes & CVs' },
    { id: 'certificate', label: 'Certifications' },
    { id: 'project', label: 'Project Whitepapers' },
    { id: 'internship', label: 'Internships' },
    { id: 'academic', label: 'Academic Records' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Digital Vault</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
              Encrypted Storage & Access
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Documents & Verified Credentials Vault
          </h1>
          <p className="text-xs text-content-secondary">
            Central repository for verified resumes, internship completion letters, certificates, and technical whitepapers
          </p>
        </div>

        {/* User Filter */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'sreesh', label: "Sreesh's Vault" },
            { id: 'mrithula', label: "Mrithula's Vault" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedUser(tab.id as typeof selectedUser);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUser === tab.id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFx.playClick();
              setActiveCategory(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-surface-elevated border border-border-strong text-content-primary font-semibold'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl border border-border-subtle bg-surface-card flex flex-col justify-between space-y-4 hover:bg-surface-elevated/40 transition-colors group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-burgundy-soft">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-content-muted">
                  {doc.fileType} • {(doc.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-burgundy-soft shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-content-primary group-hover:text-burgundy-soft transition-colors leading-snug break-all">
                    {doc.title}
                  </h3>
                  <span className="text-[10px] font-mono text-content-muted">
                    Owner: {doc.ownerId === 'shared' ? 'Studio Shared' : doc.ownerId === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-content-muted">
                {doc.isPrivate ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-emerald-400" />}
                <span>{doc.isPrivate ? 'Private' : 'Studio Shared'}</span>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setPreviewDoc(doc);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 text-xs font-semibold text-content-primary transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Record</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border-strong bg-surface-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-mono uppercase text-burgundy-soft font-bold">Document Inspector</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-xs font-mono text-content-muted hover:text-content-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-content-primary break-all">{previewDoc.title}</h3>
              <p className="text-xs font-mono text-content-secondary">
                Category: {previewDoc.category.toUpperCase()} • Size: {(previewDoc.sizeBytes / 1024).toFixed(1)} KB
              </p>
              <p className="text-xs font-mono text-content-muted">
                Uploaded: {previewDoc.uploadedAt} • File Type: {previewDoc.fileType}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border-subtle text-xs text-content-secondary space-y-2">
              <p>
                <strong>Security Verification:</strong> This document is registered in the studio's secure storage ledger.
              </p>
              <p className="text-[11px] text-content-muted font-mono">
                Hash: sha256-{previewDoc.id.substring(0, 16)}...
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playChime();
                alert(`Downloaded record for ${previewDoc.title}`);
                setPreviewDoc(null);
              }}
              className="w-full py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File Copy</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

