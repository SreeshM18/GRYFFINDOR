import React, { useEffect, useState } from 'react';
import { useSuperAdaptiveTheme } from '../../context/SuperAdaptiveThemeContext';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  Wand2,
  X,
  Check,
  RotateCcw,
  Sliders,
  Palette,
  Layers,
  Square,
  Crosshair,
} from 'lucide-react';

export const LiveDesignModeInspector: React.FC = () => {
  const {
    designModeActive,
    toggleDesignMode,
    selectedElementId,
    selectElement,
    elementOverrides,
    setElementOverride,
  } = useSuperAdaptiveTheme();

  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [currentStyles, setCurrentStyles] = useState<{
    bg: string;
    text: string;
    border: string;
    radius: number;
  }>({
    bg: '#141416',
    text: '#F5F0E6',
    border: '#2A2A30',
    radius: 16,
  });

  // Attach hover and click listeners when Design Mode is active
  useEffect(() => {
    if (!designModeActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip the inspector itself
      if (target.closest('#gryffindor-live-inspector')) return;
      setHoveredEl(target);
      target.style.outline = '2px dashed #D3A625';
      target.style.outlineOffset = '2px';
      target.style.cursor = 'crosshair';
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#gryffindor-live-inspector')) return;
      target.style.outline = '';
      target.style.outlineOffset = '';
      target.style.cursor = '';
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#gryffindor-live-inspector')) return;
      e.preventDefault();
      e.stopPropagation();

      // Ensure target has an ID or assign a stable data-editor-id
      let id = target.id;
      if (!id) {
        id = `elem-${target.tagName.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;
        target.id = id;
      }

      soundFx.playChime();
      selectElement(id);

      // Read computed styles to prepopulate inspector
      const comp = window.getComputedStyle(target);
      const existing = elementOverrides[id] || {};
      setCurrentStyles({
        bg: existing.bg || rgbToHex(comp.backgroundColor) || '#141416',
        text: existing.text || rgbToHex(comp.color) || '#F5F0E6',
        border: existing.border || rgbToHex(comp.borderColor) || '#2A2A30',
        radius: existing.radius !== undefined ? existing.radius : parseInt(comp.borderRadius, 10) || 16,
      });
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
    };
  }, [designModeActive, selectElement, elementOverrides]);

  function rgbToHex(rgbStr: string): string {
    const match = rgbStr.match(/\d+/g);
    if (!match || match.length < 3) return '#141416';
    const [r, g, b] = match.map(Number);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  const applyStyleChange = (key: 'bg' | 'text' | 'border' | 'radius', value: any) => {
    if (!selectedElementId) return;
    const next = { ...currentStyles, [key]: value };
    setCurrentStyles(next);
    setElementOverride(selectedElementId, next);
  };

  const clearSelectedElementStyle = () => {
    if (!selectedElementId) return;
    soundFx.playClick();
    const el = document.getElementById(selectedElementId);
    if (el) {
      el.style.backgroundColor = '';
      el.style.color = '';
      el.style.borderColor = '';
      el.style.borderRadius = '';
    }
    setElementOverride(selectedElementId, {});
    selectElement(null);
  };

  if (!designModeActive) return null;

  return (
    <div
      id="gryffindor-live-inspector"
      className="fixed bottom-6 right-6 z-50 animate-slide-up select-none max-w-sm w-full font-sans"
    >
      <div className="rounded-3xl border border-gold/40 bg-surface-card/95 backdrop-blur-2xl shadow-2xl p-5 space-y-4 text-xs">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold text-black font-extrabold shadow-sm">
              <Crosshair className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-content-primary flex items-center gap-1.5">
                <span>Live Website Designer</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-content-muted">
                {selectedElementId ? `Editing: #${selectedElementId}` : 'Click any element on the page'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleDesignMode}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-elevated transition-colors"
            title="Exit Design Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Element Editor */}
        {selectedElementId ? (
          <div className="space-y-3.5">
            {/* Background Color */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-content-muted flex items-center justify-between">
                <span>Background Color</span>
                <span className="text-content-primary font-bold">{currentStyles.bg}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.bg}
                  onChange={(e) => applyStyleChange('bg', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={currentStyles.bg}
                  onChange={(e) => applyStyleChange('bg', e.target.value)}
                  className="flex-1 bg-surface-elevated border border-border-subtle rounded-lg px-2.5 py-1.5 font-mono text-xs text-content-primary"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-content-muted flex items-center justify-between">
                <span>Text / Foreground Color</span>
                <span className="text-content-primary font-bold">{currentStyles.text}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.text}
                  onChange={(e) => applyStyleChange('text', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={currentStyles.text}
                  onChange={(e) => applyStyleChange('text', e.target.value)}
                  className="flex-1 bg-surface-elevated border border-border-subtle rounded-lg px-2.5 py-1.5 font-mono text-xs text-content-primary"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-content-muted flex items-center justify-between">
                <span>Border Color</span>
                <span className="text-content-primary font-bold">{currentStyles.border}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.border}
                  onChange={(e) => applyStyleChange('border', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={currentStyles.border}
                  onChange={(e) => applyStyleChange('border', e.target.value)}
                  className="flex-1 bg-surface-elevated border border-border-subtle rounded-lg px-2.5 py-1.5 font-mono text-xs text-content-primary"
                />
              </div>
            </div>

            {/* Radius Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-content-muted">
                <span>Corner Radius</span>
                <span>{currentStyles.radius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={currentStyles.radius}
                onChange={(e) => applyStyleChange('radius', Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => selectElement(null)}
                className="flex-1 py-2 rounded-xl bg-gold hover:bg-gold-soft text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done Editing</span>
              </button>
              <button
                onClick={clearSelectedElementStyle}
                className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-card border border-border-subtle text-content-muted hover:text-content-primary transition-colors"
                title="Reset this element to default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border-subtle text-center space-y-2">
            <Wand2 className="w-6 h-6 text-gold mx-auto animate-bounce" />
            <p className="text-xs text-content-primary font-medium">
              Hover over any element on your screen and click to customize its style live.
            </p>
            <p className="text-[10px] font-mono text-content-muted">
              Card backgrounds, navigation headers, text colors, and corner radii.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

