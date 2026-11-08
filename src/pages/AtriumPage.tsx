import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Lock, Compass, Eye, ShieldCheck, Globe } from 'lucide-react';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';

export const AtriumPage: React.FC = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 01. THE CELESTIAL ARCHIVE ATRIUM ENTRANCE (Directly from Use this now/index.html) */}
      <section className="relative min-h-[640px] sm:min-h-[720px] rounded-3xl border border-gold/30 bg-gradient-to-br from-[#160E12] via-[#0D0B0E] to-[#090A0D] overflow-hidden p-8 sm:p-16 flex flex-col justify-between shadow-2xl">
        {/* Repeating Cadence Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(226, 188, 118, 0.08) 0px, rgba(226, 188, 118, 0.08) 1px, transparent 1px, transparent 86px)',
          }}
        />

        {/* 3D Celestial Portal with Rotating Folios and Stars */}
        <div
          className="absolute right-[-10%] sm:right-6 top-16 w-[340px] sm:w-[540px] h-[540px] pointer-events-none opacity-80"
          style={{ perspective: '850px', transformStyle: 'preserve-3d' }}
          aria-hidden="true"
        >
          {/* Concentric Portal Rings */}
          <div
            className="absolute inset-8 rounded-full border border-gold/40 shadow-[0_0_80px_rgba(150,71,69,0.25)] animate-spin-slow"
            style={{ transform: 'rotate(-14deg) rotateY(-23deg)' }}
          />
          <div
            className="absolute inset-20 rounded-full border border-gold/25"
            style={{ transform: 'rotate(21deg) rotateY(33deg)' }}
          />
          <div
            className="absolute inset-32 rounded-full border border-gold/20"
            style={{ transform: 'rotate(-48deg) rotateY(30deg)' }}
          />

          {/* Floating Folios */}
          <div
            className="absolute top-[18%] left-[11%] w-[150px] h-[160px] rounded-2xl bg-gradient-to-br from-scarlet/70 to-surface-card border border-gold/40 shadow-2xl flex items-center justify-center text-4xl text-gold/70 font-serif"
            style={{ transform: 'rotate(-13deg) rotateY(27deg) translateZ(20px)' }}
          >
            ✧
          </div>
          <div
            className="absolute top-[7%] right-[8%] w-[140px] h-[130px] rounded-2xl bg-gradient-to-br from-burgundy/80 to-surface-card border border-gold/40 shadow-2xl flex items-center justify-center text-3xl text-gold/60 font-serif"
            style={{ transform: 'rotate(14deg) rotateY(-20deg) translateZ(65px)' }}
          >
            ◇
          </div>
          <div
            className="absolute bottom-6 right-[24%] w-[160px] h-[150px] rounded-2xl bg-gradient-to-br from-surface-elevated to-surface-card border border-gold/40 shadow-2xl flex items-center justify-center text-4xl text-gold/80 font-serif"
            style={{ transform: 'rotate(-6deg) rotateX(17deg) translateZ(84px)' }}
          >
            ✦
          </div>

          {/* Glimmering Star Nodes */}
          <div className="absolute top-[8%] left-[24%] w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_#CCA96B] animate-ping" />
          <div className="absolute top-[71%] left-[10%] w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_#CCA96B]" />
          <div className="absolute top-[41%] right-[5%] w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_#CCA96B] animate-pulse" />
        </div>

        {/* Entrance Content */}
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-gold">
            <span className="w-8 h-px bg-gold" />
            <span>A PRIVATE UNIVERSE FOR TWO</span>
          </div>

          <h1 className="text-5xl sm:text-8xl md:text-9xl font-display font-extrabold text-content-primary tracking-tight leading-[0.88]">
            GRYFFIN<br />DOR.
          </h1>

          <p className="text-base sm:text-xl text-content-secondary leading-relaxed font-serif italic max-w-lg">
            "The Common Room — where ideas become projects, days become stories, and everything important has a place."
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              to="/app/dashboard"
              onClick={() => soundFx.playChime()}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-black text-xs font-bold transition-all shadow-xl flex items-center gap-2"
            >
              <span>Enter My Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/worlds"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-xl border border-gold/30 bg-surface-card hover:bg-surface-elevated text-xs font-semibold text-content-primary transition-colors flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-gold" />
              <span>Dimension Atlas (17 Worlds)</span>
            </Link>

            <Link
              to="/work"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated text-xs font-semibold text-content-secondary hover:text-content-primary transition-colors flex items-center gap-2"
            >
              <span>Explore Our Work</span>
            </Link>
          </div>

          <p className="text-[11px] font-mono text-content-muted pt-4 max-w-md">
            An original dark-academia interface with genuine 3D spatial depth. Preserving Sreesh M & Mrithula's independent profiles and sovereign workspace.
          </p>
        </div>
      </section>

      {/* 02. THREE PILLARS (Directly from Use this now/index.html) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PerspectiveCard intensity={12} glareOpacity={0.25} className="h-full">
          <div className="h-full p-8 rounded-3xl border border-gold/30 bg-surface-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                01 / MY CHAMBER
              </span>
              <h3 className="text-2xl font-serif italic font-light text-content-primary leading-snug">
                A quieter way<br />to organize life.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Notes, personal goals, schedule, attendance ledger, and private progress in one calm, sovereign home.
              </p>
            </div>
            <Link
              to="/app/my-space"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:underline pt-2"
            >
              <span>Open My Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </PerspectiveCard>

        <PerspectiveCard intensity={12} glareOpacity={0.25} className="h-full">
          <div className="h-full p-8 rounded-3xl border border-gold/30 bg-surface-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                02 / THE QUEST BOARD
              </span>
              <h3 className="text-2xl font-serif italic font-light text-content-primary leading-snug">
                Make every<br />idea count.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Projects, tasks, milestones, collaborative pipelines, and a clear architectural roadmap ahead.
              </p>
            </div>
            <Link
              to="/app/tasks"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:underline pt-2"
            >
              <span>Manage Quests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </PerspectiveCard>

        <PerspectiveCard intensity={12} glareOpacity={0.25} className="h-full">
          <div className="h-full p-8 rounded-3xl border border-gold/30 bg-surface-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                03 / THE OBSERVATORY
              </span>
              <h3 className="text-2xl font-serif italic font-light text-content-primary leading-snug">
                See the entire<br />picture.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Timelines, charts, calendar schedules, heatmaps, and financial candlestick analytics from recorded telemetry.
              </p>
            </div>
            <Link
              to="/app/analytics"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:underline pt-2"
            >
              <span>Enter Observatory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </PerspectiveCard>
      </section>
    </div>
  );
};
