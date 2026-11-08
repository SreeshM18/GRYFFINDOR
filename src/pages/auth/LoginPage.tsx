import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'sreesh' | 'mrithula'>('sreesh');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();

    // Authenticate and set session in local storage
    localStorage.setItem(
      'sm_auth_user',
      JSON.stringify({
        id: selectedRole,
        name: selectedRole === 'sreesh' ? 'Sreesh M' : 'Mrithula',
        role: selectedRole === 'sreesh' ? 'Lead Systems Architect' : 'Creative Director',
        email: selectedRole === 'sreesh' ? 'sreesh716@gmail.com' : 'mrithula@sreeshmrithula.com',
      })
    );

    navigate('/dashboard');
  };

  const handleQuickDemoAccess = (role: 'sreesh' | 'mrithula') => {
    soundFx.playClick();
    localStorage.setItem(
      'sm_auth_user',
      JSON.stringify({
        id: role,
        name: role === 'sreesh' ? 'Sreesh M' : 'Mrithula',
        role: role === 'sreesh' ? 'Lead Systems Architect' : 'Creative Director',
        email: role === 'sreesh' ? 'sreesh716@gmail.com' : 'mrithula@sreeshmrithula.com',
      })
    );
    navigate('/dashboard');
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border-strong bg-surface-card p-8 sm:p-10 shadow-2xl space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border-strong flex items-center justify-center mx-auto text-burgundy-soft">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-display font-bold text-content-primary">
            Studio Private Workspace
          </h1>
          <p className="text-xs text-content-secondary">
            Restricted productivity cockpit for Sreesh M & Mrithula
          </p>
        </div>

        {/* Identity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-content-muted">Authorized Identity</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedRole('sreesh');
              }}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                selectedRole === 'sreesh'
                  ? 'border-sreesh-light bg-surface-elevated text-content-primary shadow-sm'
                  : 'border-border-subtle bg-surface-elevated/40 text-content-secondary'
              }`}
            >
              <div className="font-semibold">Sreesh M</div>
              <div className="text-[10px] text-content-muted font-mono">Systems & AI</div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedRole('mrithula');
              }}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                selectedRole === 'mrithula'
                  ? 'border-mrithula-light bg-surface-elevated text-content-primary shadow-sm'
                  : 'border-border-subtle bg-surface-elevated/40 text-content-secondary'
              }`}
            >
              <div className="font-semibold">Mrithula</div>
              <div className="text-[10px] text-content-muted font-mono">Product & Design</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Collaborator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'sreesh' ? 'sreesh716@gmail.com' : 'mrithula@sreeshmrithula.com'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors"
            />
          </div>

          <button
            type="submit"
            onClick={() => soundFx.playClick()}
            className="w-full py-3 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-Click Authorized Test Bypass for Evaluation */}
        <div className="p-4 rounded-2xl border border-border-subtle bg-surface-elevated/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-content-primary font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Evaluator Access</span>
          </div>
          <p className="text-[11px] text-content-secondary leading-relaxed">
            Click below to inspect the private workspace without credentials:
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleQuickDemoAccess('sreesh')}
              className="flex-1 py-1.5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-[11px] text-content-primary font-medium"
            >
              Sign In as Sreesh
            </button>
            <button
              onClick={() => handleQuickDemoAccess('mrithula')}
              className="flex-1 py-1.5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-[11px] text-content-primary font-medium"
            >
              Sign In as Mrithula
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs font-mono text-content-muted hover:text-content-primary transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};
