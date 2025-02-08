// hooks/useSkillsModal.js
import { useState, useCallback } from 'react';

export function useSkillsModal(skillsData, onClose) {
  const [activeModal, setActiveModal] = useState(null);

  const determineInitialModal = useCallback(() => {
    if (skillsData.isImproved && skillsData.analysisResults) {
      return 'improved';
    } else if (skillsData.analysisResults) {
      return 'results';
    }
    return 'analysis';
  }, [skillsData.isImproved, skillsData.analysisResults]);

  const handleModalTransition = useCallback((modalType) => {
    setActiveModal(modalType);
  }, []);

  return {
    activeModal: activeModal || determineInitialModal(),
    handleModalTransition
  };
}