import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  DollarSign,
  FileCheck2,
  Plus,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Send,
  FileText,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { ClientProject } from '../../types/workOs';

export const ClientFreelancePage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [showModal, setShowModal] = useState(false);

  // New Client form
  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState<ClientProject['currency']>('INR');
  const [timeline, setTimeline] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [assignedTo, setAssignedTo] = useState<ClientProject['assignedTo']>('both');

  const loadData = () => {
    setProjects(workOs.getClientProjects());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectTitle.trim() || !budget) return;

    soundFx.playClick();
    workOs.createClientProject({
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      status: 'proposal',
      budgetAmount: parseFloat(budget),
      currency,
      paidAmount: 0,
      deliverables: deliverables.split(',').map((d) => d.trim()).filter(Boolean),
      timeline: timeline.trim() || '6 Weeks',
      leadContact: leadContact.trim() || 'contact@client.com',
      assignedTo,
    });

    setClientName('');
    setProjectTitle('');
    setBudget('');
    setTimeline('');
    setDeliverables('');
    setLeadContact('');
    setShowModal(false);
    loadData();
  };

  const totalContractedInr = projects
    .filter((p) => p.currency === 'INR')
    .reduce((acc, p) => acc + p.budgetAmount, 0);

  const totalPaidInr = projects
    .filter((p) => p.currency === 'INR')
    .reduce((acc, p) => acc + p.paidAmount, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Client & Freelance Studio Hub
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Bespoke Studio Delivery
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Manage commercial client engagements, proposals, statements of work (SOW), milestones, and invoicing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Client Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Total Contract Value</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              ₹{(totalContractedInr / 1000).toFixed(0)}k <span className="text-xs font-normal text-content-muted">INR</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">
              Collected: ₹{(totalPaidInr / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Active Engagements</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              {projects.length}
            </div>
            <div className="text-[10px] font-mono text-content-muted mt-1">
              1 In-Progress • 1 In-Proposal
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-burgundy-soft">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Studio Capacity</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              80% <span className="text-xs font-normal text-content-muted">allocated</span>
            </div>
            <div className="text-[10px] font-mono text-content-muted mt-1">
              Available for Q1 2027 advisory
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Client Projects List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-content-primary">Client Statements of Work (SOW)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isCompleted = proj.status === 'completed';
            const isInProgress = proj.status === 'in_progress';

            return (
              <div
                key={proj.id}
                className="rounded-2xl border border-border-subtle bg-surface-card p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-sm hover:border-burgundy/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-content-muted border border-border-subtle uppercase">
                      Timeline: {proj.timeline}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border capitalize ${
                      isInProgress ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-burgundy-soft font-semibold">{proj.clientName}</div>
                    <h3 className="font-display font-bold text-lg text-content-primary mt-0.5">
                      {proj.projectTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      Budget: <span className="font-bold text-content-primary">₹{proj.budgetAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      Paid: <span className="font-bold text-emerald-400">₹{proj.paidAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                    <div className="text-[10px] font-mono uppercase text-content-muted">Key Deliverables</div>
                    {proj.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-content-secondary">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-content-muted">
                  <div>Assigned: <span className="capitalize text-content-primary">{proj.assignedTo}</span></div>
                  <div className="text-content-secondary">{proj.leadContact}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Client Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">New Client Engagement</h3>
              <button onClick={() => setShowModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Client / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurelia Holidays / Startup Client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Booking Engine & Brand Identity"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Budget Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Weeks"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Deliverables (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="UI Design in Figma, React 19 Frontend, Supabase Database"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Lead Contact Email</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

