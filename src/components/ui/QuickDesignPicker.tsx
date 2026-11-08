import React, { useState, useRef, useEffect } from 'react';
import { useDesignSystem, DESIGN_PRESETS, SignatureDesign } from '../../context/DesignSystemContext';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { soundFx } from './AudioSynthesizer';

export const QuickDesignPicker: React.FC = () => {
  const { currentDesign, setDesign, preset } = useDesignSystem();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-xs transition-colors"
        title="Switch to any website design"
        aria-label="Signature Design Switcher"
      >
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: preset.accentColor }}
        />
        <span className="font-mono text-content-primary hidden md:inline text-[11px]">
          {preset.name.split(' ')[0]}
        </span>
        <ChevronDown className={`w-3 h-3 text-content-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-border-subtle bg-surface-card/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
          <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1.5 text-content-primary font-medium">
              <Palette className="w-3.5 h-3.5 text-gold" />
              Signature Design Engine
            </span>
            <span>8 Engines</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 py-1">
            {DESIGN_PRESETS.map((p) => {
              const isSelected = p.id === currentDesign;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setDesign(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-surface-elevated border border-border-strong text-content-primary'
                      : 'hover:bg-surface-elevated/60 text-content-secondary'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full mt-0.5 border border-white/30 shrink-0 shadow"
                      style={{ backgroundColor: p.accentColor }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-medium text-xs text-content-primary">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-content-muted">
                          [{p.folderNum}]
                        </span>
                      </div>
                      <p className="text-[11px] text-content-muted line-clamp-1 mt-0.5">
                        {p.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-border-subtle bg-surface-elevated/40 rounded-lg text-[10px] font-mono text-content-muted flex items-center justify-between">
            <span>Adapted from 'Use this now' mirrors</span>
            <span className="text-gold">Live System</span>
          </div>
        </div>
      )}
    </div>
  );
};
