import React, { useState, useEffect } from 'react';
import { Layers, Box, Sparkles, Volume2, VolumeX, Eye, Compass, Activity } from 'lucide-react';
import { soundFx } from './AudioSynthesizer';

export type DimensionMode = 'editorial' | 'spatial' | 'blueprint';

interface DimensionalHUDProps {
  onDimensionChange?: (mode: DimensionMode) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const DimensionalHUD: React.FC<DimensionalHUDProps> = ({
  onDimensionChange,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [activeDimension, setActiveDimension] = useState<DimensionMode>('spatial');
  const [fps, setFps] = useState<number>(60);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Measure rough framerate for high-craft telemetry
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSelect = (mode: DimensionMode) => {
    soundFx.playClick();
    setActiveDimension(mode);
    onDimensionChange?.(mode);
  };

  return (
    <aside
      aria-label="Spatial Dimension Switcher"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none"
    >
      {/* Expanded Dimensional Controls Panel */}
      {expanded && (
        <div className="p-3.5 rounded-2xl border border-gold/30 bg-surface-card/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-3 w-64 animate-slide-up text-xs font-mono">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <span className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Spatial Engine</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-emerald-400 font-bold border border-emerald-500/20">
              {fps} FPS
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-content-muted uppercase tracking-wider">Perspective View</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleSelect('editorial')}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  activeDimension === 'editorial'
                    ? 'bg-burgundy text-white font-bold border border-gold/40 shadow-sm'
                    : 'bg-surface-elevated text-content-secondary hover:text-content-primary border border-border-subtle'
                }`}
              >
                Editorial
              </button>
              <button
                type="button"
                onClick={() => handleSelect('spatial')}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  activeDimension === 'spatial'
                    ? 'bg-burgundy text-white font-bold border border-gold/40 shadow-sm'
                    : 'bg-surface-elevated text-content-secondary hover:text-content-primary border border-border-subtle'
                }`}
              >
                3D Spatial
              </button>
              <button
                type="button"
                onClick={() => handleSelect('blueprint')}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  activeDimension === 'blueprint'
                    ? 'bg-burgundy text-white font-bold border border-gold/40 shadow-sm'
                    : 'bg-surface-elevated text-content-secondary hover:text-content-primary border border-border-subtle'
                }`}
              >
                Blueprint
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-content-secondary">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-gold" />
              <span>Tactile Audio</span>
            </span>
            <button
              type="button"
              onClick={() => {
                soundFx.playChime();
                onToggleSound?.();
              }}
              className="p-1.5 rounded-lg border border-border-subtle bg-surface-elevated text-gold hover:bg-gold/10 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => {
          soundFx.playClick();
          setExpanded(!expanded);
        }}
        className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-gold/40 bg-surface-card/90 backdrop-blur-md shadow-2xl hover:border-gold transition-all text-xs font-mono text-content-primary hover:shadow-[0_0_25px_rgba(211,166,37,0.25)]"
      >
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-[11px] font-bold tracking-wide uppercase text-gold">
          {activeDimension === 'spatial' ? '3D Spatial' : activeDimension === 'blueprint' ? 'Blueprint' : 'Editorial'}
        </span>
        <Box className="w-3.5 h-3.5 text-gold group-hover:rotate-45 transition-transform" />
      </button>
    </aside>
  );
};

