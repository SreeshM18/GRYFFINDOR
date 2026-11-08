import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { soundFx } from '../ui/AudioSynthesizer';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-subtle bg-surface-card/60 transition-colors py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Statement */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-content-primary tracking-wider">
                GRYFFINDOR
              </span>
              <span className="text-xs font-mono text-gold px-2 py-0.5 rounded border border-gold/30 bg-gold/10">
                The Common Room
              </span>
            </div>
            <p className="text-xs text-content-secondary max-w-md leading-relaxed">
              Personal sanctuary, academic vault, and high-performance engineering workspace for Sreesh M and Mrithula. Autonomous systems, distributed full-stack architectures, and bespoke design craft.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-elevated text-[11px] text-content-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for selected engineering & design collaborations</span>
            </div>
          </div>

          {/* Independent Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-content-muted">Independent Portfolios</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/sreesh"
                  onClick={() => soundFx.playClick()}
                  className="text-content-secondary hover:text-content-primary flex items-center justify-between group"
                >
                  <span>Sreesh M (AI & Systems)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/mrithula"
                  onClick={() => soundFx.playClick()}
                  className="text-content-secondary hover:text-content-primary flex items-center justify-between group"
                >
                  <span>Mrithula (Product & UI/UX)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/collaborations"
                  onClick={() => soundFx.playClick()}
                  className="text-content-secondary hover:text-content-primary flex items-center justify-between group"
                >
                  <span>Shared Studio Works</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/resumes"
                  onClick={() => soundFx.playClick()}
                  className="text-content-secondary hover:text-content-primary flex items-center justify-between group"
                >
                  <span>Curriculum Vitae (PDF)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-content-muted">Connect & Inquiries</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sreesh"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
                aria-label="GitHub Organization / Repositories"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
                aria-label="LinkedIn Profiles"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="p-2 rounded-lg border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
                aria-label="Contact Studio"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-[11px] text-content-muted font-mono">
              Inquiries: contact@sreeshmrithula.com
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-content-muted">
          <span>© {new Date().getFullYear()} Sreesh M & Mrithula. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-content-secondary">Story</Link>
            <span>•</span>
            <Link to="/journey" className="hover:text-content-secondary">Milestones</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-gold flex items-center gap-1">
              <span>The Common Room</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
