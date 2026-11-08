import React, { useState } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { Radio, Play, Pause, Volume2, Sparkles, Tv, ArrowRight } from 'lucide-react';

interface BroadcastItem {
  id: string;
  tag: string;
  title: string;
  duration: string;
  author: string;
  highlightColor: string;
}

const BROADCAST_FEEDS: BroadcastItem[] = [
  {
    id: 'feed-1',
    tag: 'SYSTEM LAUNCH',
    title: 'Gryffindor Common Room: 17 Dimensional Universes Synchronized',
    duration: '02:45',
    author: 'Sreesh & Mrithula',
    highlightColor: '#D5FF7A',
  },
  {
    id: 'feed-2',
    tag: 'SPATIAL TELEMETRY',
    title: 'Perspective Tilt Shaders & Ambient KaTeX Mathematical Canvas',
    duration: '01:18',
    author: 'Systems Lab',
    highlightColor: '#FF957A',
  },
  {
    id: 'feed-3',
    tag: 'DESIGN CONVERGENCE',
    title: 'Cross-Portfolio Synthesis: 19 Mirrors Translated to Production Code',
    duration: '03:12',
    author: 'Atelier Lead',
    highlightColor: '#8D90FF',
  },
];

export const EyeballsBroadcastWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<BroadcastItem>(BROADCAST_FEEDS[0]);

  const togglePlay = () => {
    soundFx.playClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-border-subtle bg-black text-white">
      {/* Header Attribution / Soul of eyeballs.co */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#D5FF7A]/10 text-[#D5FF7A] border border-[#D5FF7A]/20">
            <Tv className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-white">
                Eyeballs — Broadcast Media Library
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#D5FF7A]/20 text-[#D5FF7A] border border-[#D5FF7A]/40 font-bold">
                Folder 01 Mirror
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Electric Lime (#D5FF7A), Infinite High-Voltage Marquee, Figtree Typography, and Broadcast Ribbons
            </p>
          </div>
        </div>

        {/* Live Broadcast Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="text-red-400 font-bold tracking-wider">LIVE ON-AIR</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">1080p60</span>
        </div>
      </div>

      {/* =========================================================================
          INFINITE MARQUEE TICKER (EYEBALLS SIGNATURE)
      ========================================================================= */}
      <div className="relative overflow-hidden py-2 bg-[#D5FF7A] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg select-none">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <span>★ SREESH × MRITHULA OPERATING SYSTEM</span>
          <span>✦ 17 DIMENSIONAL WORLDS LIVE</span>
          <span>★ 0% DRIFT FULL DUAL-SYNC</span>
          <span>✦ BENGALURU CREATIVE WORKSPACE</span>
          <span>★ HARDWARE TELEMETRY 60 FPS</span>
          <span>✦ GRYFFINDOR COMMON ROOM</span>
          <span>★ SREESH × MRITHULA OPERATING SYSTEM</span>
          <span>✦ 17 DIMENSIONAL WORLDS LIVE</span>
        </div>
      </div>

      {/* Broadcast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BROADCAST_FEEDS.map((feed) => {
          const isActive = activeItem.id === feed.id;
          return (
            <div
              key={feed.id}
              onClick={() => {
                soundFx.playChime();
                setActiveItem(feed);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isActive
                  ? 'bg-zinc-900 border-[#D5FF7A] shadow-[0_0_20px_rgba(213,255,122,0.15)]'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider"
                    style={{ backgroundColor: `${feed.highlightColor}20`, color: feed.highlightColor }}
                  >
                    {feed.tag}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">{feed.duration}</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white leading-snug">
                  {feed.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-900">
                <span>By {feed.author}</span>
                <span className="text-[#D5FF7A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Reel →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Feature Player Bar */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#D5FF7A] text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
          </button>
          <div>
            <p className="font-display font-medium text-sm text-white">{activeItem.title}</p>
            <p className="text-xs font-mono text-zinc-400">Stream Source: E:\Projects\sreesh-mrithula\Use this now\1</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <Volume2 className="w-4 h-4 text-[#D5FF7A]" />
          <span>Synthesized 44.1 kHz</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">FIGTREE</span>
        </div>
      </div>
    </div>
  );
};
