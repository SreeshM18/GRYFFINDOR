import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, Shield, Zap, Award } from 'lucide-react';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Individual minds.<br />Shared ambition.
        </h1>
        <p className="text-base sm:text-lg text-content-secondary leading-relaxed pt-2">
          SREESH × MRITHULA was established on a shared conviction: that modern digital products achieve enduring quality only when architectural rigor and uncompromising visual craft exist in equal measure.
        </p>
      </div>

      {/* The Story */}
      <div className="space-y-6 text-sm text-content-secondary leading-relaxed sm:text-base border-t border-border-subtle pt-10">
        <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">The Genesis</h2>
        <p>
          We began as two engineering and design students collaborating across university hackathons, open-source explorations, and deep technical systems. Sreesh brought an obsession with distributed software architecture, agentic AI, graph traversal, and WebGL rendering loops. Mrithula brought a relentless focus on human empathy, atomic design tokens, cognitive clarity, and accessible interaction models.
        </p>
        <p>
          Rather than diluting our identities into a generic startup or burying ourselves in conventional resume websites, we conceived a dual-identity studio: two independent professionals operating within one shared creative and operational space.
        </p>
      </div>

      {/* 10 Non-Negotiable Design Tenets */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Tenets of Craft</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { num: '01', title: 'Purpose before decoration', desc: 'Every visual element must serve comprehension or utility.' },
            { num: '02', title: 'Typography before visual effects', desc: 'Clear editorial hierarchy conveys competence faster than shaders.' },
            { num: '03', title: 'Originality before trends', desc: 'Avoid ephemeral purple gradients and cookie-cutter SaaS aesthetics.' },
            { num: '04', title: 'Quality before quantity', desc: 'Ship few deeply engineered systems rather than dozens of toy clones.' },
            { num: '05', title: 'Performance before animation', desc: 'Frame rates and sub-second load times never take a back seat.' },
            { num: '06', title: 'Clarity before complexity', desc: 'Simple code contracts scale; convoluted cleverness breaks.' },
            { num: '07', title: 'Accessibility by default', desc: 'High-contrast typography and keyboard navigation are non-negotiable.' },
            { num: '08', title: 'Zero fabrication', desc: 'Every metric, credential, and skill presented is verified in real code.' },
          ].map((item) => (
            <div key={item.num} className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1.5">
              <span className="text-[10px] font-mono text-burgundy-soft">{item.num}</span>
              <h3 className="font-semibold text-sm text-content-primary">{item.title}</h3>
              <p className="text-xs text-content-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Callout */}
      <div className="p-8 rounded-3xl border border-border-strong bg-surface-card text-center space-y-4">
        <h3 className="text-2xl font-display font-bold text-content-primary">
          Ready to collaborate?
        </h3>
        <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto">
          Explore our individual portfolios or reach out directly to discuss high-impact software engagements.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/work"
            onClick={() => soundFx.playClick()}
            className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white font-medium text-xs transition-colors"
          >
            Explore Projects
          </Link>
          <Link
            to="/contact"
            onClick={() => soundFx.playClick()}
            className="px-6 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary font-medium text-xs hover:bg-surface-elevated/80 transition-colors"
          >
            Contact Studio
          </Link>
        </div>
      </div>
    </div>
  );
};

