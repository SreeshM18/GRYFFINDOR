import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Plus,
  Sparkles,
  Trophy,
  User,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { JobApplication, UserId } from '../../types/workOs';

export const CareerTrackerPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [selectedUser, setSelectedUser] = useState<UserId | 'both'>(currentUser.id);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Application form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Bengaluru (Hybrid)');
  const [workType, setWorkType] = useState<JobApplication['workType']>('Hybrid');
  const [salary, setSalary] = useState('');
  const [stage, setStage] = useState<JobApplication['stage']>('applied');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    const list = workOs.getJobApplications();
    if (selectedUser === 'both') {
      setApplications(list);
    } else {
      setApplications(list.filter((j) => j.userId === selectedUser));
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedUser]);

  const handleStageChange = (id: string, nextStage: JobApplication['stage']) => {
    soundFx.playChime();
    workOs.updateJobApplicationStage(id, nextStage);
    loadData();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    soundFx.playClick();
    workOs.createJobApplication({
      userId: selectedUser === 'both' ? currentUser.id : selectedUser,
      companyName: company.trim(),
      roleTitle: role.trim(),
      location,
      workType,
      salaryRange: salary.trim() || undefined,
      stage,
      appliedDate: new Date().toISOString().split('T')[0],
      jobUrl: jobUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      rounds: [{ roundName: 'Application Submitted', date: new Date().toISOString().split('T')[0], status: 'passed' }],
    });

    setCompany('');
    setRole('');
    setSalary('');
    setJobUrl('');
    setNotes('');
    setShowAddModal(false);
    loadData();
  };

  const stages: { id: JobApplication['stage']; label: string; color: string }[] = [
    { id: 'applied', label: 'Applied', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'oa', label: 'Online Assessment', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'technical', label: 'Technical Rounds', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'hr', label: 'HR & Leadership', color: 'text-pink-400 bg-pink-500/10' },
    { id: 'offer', label: 'Offer Received', color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  const totalOffers = applications.filter((a) => a.stage === 'offer').length;
  const inInterview = applications.filter((a) => a.stage === 'technical' || a.stage === 'hr').length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Career & Placement Pipeline
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Opportunity Pipeline
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Track off-campus and placement applications, interview rounds, question banks, and compensation offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => setSelectedUser('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'both' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setSelectedUser('sreesh')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'sreesh' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Sreesh
            </button>
            <button
              onClick={() => setSelectedUser('mrithula')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'mrithula' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Mrithula
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Total Tracked</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{applications.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">In Active Interviews</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{inInterview}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Offers Extended</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{totalOffers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pipeline Stages View */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-content-primary">Active Application Flow</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app) => {
            const isSreesh = app.userId === 'sreesh';
            const userTag = isSreesh ? 'Sreesh M' : 'Mrithula M';
            const resumeFile = isSreesh ? 'Sreesh_M_Resume.pdf' : 'Mrithula_M_Resume.pdf';

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-border-subtle bg-surface-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-burgundy/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-surface-elevated text-content-secondary border border-border-subtle">
                      {app.workType} • {app.location}
                    </span>
                    <span className="text-[10px] font-mono text-burgundy-soft font-semibold capitalize">
                      {userTag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-content-primary">
                      {app.companyName}
                    </h3>
                    <p className="text-xs text-content-secondary font-medium mt-0.5">
                      {app.roleTitle}
                    </p>
                  </div>

                  {app.salaryRange && (
                    <div className="text-xs font-mono font-semibold text-emerald-400">
                      Comp: {app.salaryRange}
                    </div>
                  )}

                  {/* Interview Rounds Status */}
                  <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                    <div className="text-[10px] font-mono uppercase text-content-muted">Interview Rounds</div>
                    {app.rounds.map((r, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-elevated/40 border border-border-subtle">
                        <span className="truncate max-w-[160px]">{r.roundName}</span>
                        <span className={`text-[10px] font-mono capitalize ${
                          r.status === 'passed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-content-muted italic line-clamp-2">
                      "{app.notes}"
                    </p>
                  )}
                </div>

                {/* Stage Advancement & Actions */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <select
                    value={app.stage}
                    onChange={(e) => handleStageChange(app.id, e.target.value as JobApplication['stage'])}
                    className="text-xs p-1.5 rounded-lg border border-border-subtle bg-surface-elevated text-content-primary capitalize focus:outline-none"
                  >
                    <option value="applied">Applied</option>
                    <option value="oa">Online Assessment</option>
                    <option value="technical">Technical Round</option>
                    <option value="hr">HR Round</option>
                    <option value="offer">Offer Extended 🎉</option>
                    <option value="rejected">Archived</option>
                  </select>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-content-muted">
                    <FileText className="w-3 h-3 text-burgundy-soft" />
                    <span>{resumeFile.replace('.pdf', '')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Track Application */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">Track Career Opportunity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, Uber, Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer / Product Designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Work Type</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value as JobApplication['workType'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-Site">On-Site</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Compensation</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹28 LPA or $100k"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as JobApplication['stage'])}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                >
                  <option value="applied">Applied</option>
                  <option value="oa">Online Assessment (OA)</option>
                  <option value="technical">Technical Round</option>
                  <option value="hr">HR Round</option>
                  <option value="offer">Offer Extended</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Notes & Interview Tips</label>
                <textarea
                  rows={2}
                  placeholder="System design focus, key recruiter contacts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
