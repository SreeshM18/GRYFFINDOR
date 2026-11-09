import React from 'react';
import { MasterGodModeStudio } from '../studio/MasterGodModeStudio';

// Re-export MasterGodModeStudio as UniversalColorLabWidget for backward compatibility
export const UniversalColorLabWidget: React.FC = () => {
  return <MasterGodModeStudio />;
};

export default UniversalColorLabWidget;
