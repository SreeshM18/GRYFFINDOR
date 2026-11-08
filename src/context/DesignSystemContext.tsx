import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { DESIGN_PRESETS, SignatureDesign, DesignPresetMeta } from '../data/designPresets';

export type { SignatureDesign, DesignPresetMeta };
export { DESIGN_PRESETS };

interface DesignContextType {
  currentDesign: SignatureDesign;
  setDesign: (design: SignatureDesign) => void;
  preset: DesignPresetMeta;
  allPresets: DesignPresetMeta[];
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDesign, setCurrentDesign] = useState<SignatureDesign>(() => {
    const saved = localStorage.getItem('sm_signature_design') as SignatureDesign;
    if (saved && DESIGN_PRESETS.some((p) => p.id === saved)) {
      return saved;
    }
    return 'gryffindor';
  });

  const preset = DESIGN_PRESETS.find((p) => p.id === currentDesign) || DESIGN_PRESETS[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-design', currentDesign);
    localStorage.setItem('sm_signature_design', currentDesign);
  }, [currentDesign]);

  const setDesign = (design: SignatureDesign) => {
    soundFx.playChime();
    setCurrentDesign(design);
  };

  return (
    <DesignContext.Provider
      value={{
        currentDesign,
        setDesign,
        preset,
        allPresets: DESIGN_PRESETS,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignSystem = (): DesignContextType => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};
