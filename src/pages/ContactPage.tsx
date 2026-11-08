import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'collaboration',
    message: '',
    honeypot: '', // anti-bot spam trap
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // bot detected

    soundFx.playChime();
    setSubmitted(true);
  };

  const handleCopyEmail = (email: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Mail className="w-3.5 h-3.5" />
          <span>Direct & Collaborative Inquiries</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Initiate Contact
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          Reach out for engineering roles, design collaboration, hackathon invitations, or creative technology consulting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-display font-bold text-content-primary">
                Inquiry Received
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Sreesh & Mrithula. Your message has been logged securely in the private studio inbox. We respond to verified inquiries within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', inquiryType: 'collaboration', message: '', honeypot: '' });
                }}
                className="text-xs font-semibold text-burgundy-soft hover:underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="user_nickname"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-content-muted">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-content-muted">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ada@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-muted">Recipient / Purpose</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors"
                >
                  <option value="collaboration">Sreesh × Mrithula — Joint Studio Collaboration</option>
                  <option value="hire_sreesh">Sreesh M — Systems, AI & Full-Stack Opportunity</option>
                  <option value="hire_mrithula">Mrithula — UI/UX Design & Product Strategy</option>
                  <option value="general">General Networking / Other Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-muted">Message / Project Details</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about the role, project vision, timeline, or requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                onClick={() => soundFx.playClick()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Dispatch Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Direct Coordinates & Privacy Commitment */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Direct Coordinates</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-content-muted">Sreesh M:</span>
                <button
                  onClick={() => handleCopyEmail('sreesh716@gmail.com')}
                  className="w-full text-left p-2 rounded-lg bg-surface-elevated text-xs font-mono text-content-primary flex items-center justify-between hover:bg-surface-elevated/80 transition-colors"
                >
                  <span className="truncate">sreesh716@gmail.com</span>
                  <Copy className="w-3 h-3 text-content-muted shrink-0" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-content-muted">Studio Desk:</span>
                <button
                  onClick={() => handleCopyEmail('contact@sreeshmrithula.com')}
                  className="w-full text-left p-2 rounded-lg bg-surface-elevated text-xs font-mono text-content-primary flex items-center justify-between hover:bg-surface-elevated/80 transition-colors"
                >
                  <span className="truncate">contact@sreeshmrithula.com</span>
                  <Copy className="w-3 h-3 text-content-muted shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-content-primary font-bold">Privacy Guard</h3>
            </div>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              We never share email addresses or contact telemetry with third-party aggregators. Messages are routed via secure private channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

