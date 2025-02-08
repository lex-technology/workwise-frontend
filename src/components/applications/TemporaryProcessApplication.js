'use client'

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import SkillsAnalysisModal from './SkillsAnalysisModal';
import SkillsAnalysisResultModal from './SkillsAnalysisResultModal';
import SkillsImprovedModal from './SkillsImprovedModal';
import { useApi } from '@/utils/api';

// Define modal states
const MODAL_STATES = {
    INITIAL: 'INITIAL',
    ANALYSIS: 'ANALYSIS',
    IMPROVED: 'IMPROVED'
};

function AIAnalysisModal({ 
    isOpen, 
    onClose, 
    currentContent,
    onVersionSelect,
    resumeId,
    resumeData 
}) {
    const [versions, setVersions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [currentSkills, setCurrentSkills] = useState(null);
    const [modalState, setModalState] = useState(MODAL_STATES.INITIAL);
    const { fetchWithAuth } = useApi();
    
    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen || !resumeId || !resumeData) return;

            try {
                setLoading(true);
                console.log('Starting data fetch with resumeData:', resumeData);
                
                // Set current skills from resumeData
                const skillsData = [{
                    technical_skills: resumeData.skills?.[0]?.technical_skills,
                    soft_skills: resumeData.skills?.[0]?.soft_skills
                }];
                setCurrentSkills(skillsData);

                // Check if skills were previously analyzed
                const analysisResponse = await fetchWithAuth(`http://localhost:8000/api/resume/${resumeId}/skills-analysis`);
                console.log('Analysis response:', analysisResponse);

                if (analysisResponse.analysis) {
                    setVersions(analysisResponse.analysis);
                    
                    // Determine initial state based on resumeData
                    let improvedSections;
                    try {
                        improvedSections = typeof resumeData.ai_improved_sections === 'string' 
                            ? JSON.parse(resumeData.ai_improved_sections)
                            : resumeData.ai_improved_sections || {};
                    } catch (e) {
                        console.warn('Error parsing ai_improved_sections:', e);
                        improvedSections = {};
                    }

                    // Set initial state
                    setModalState(improvedSections?.skills ? MODAL_STATES.IMPROVED : MODAL_STATES.ANALYSIS);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, resumeId, resumeData, fetchWithAuth]);

    const handleImprove = async () => {
        try {
            setAnalysisLoading(true);
            console.log('Starting skills analysis...');
            
            const response = await fetchWithAuth('http://localhost:8000/api/resume/analyze-skills', {
                method: 'POST',
                body: JSON.stringify({
                    resumeId,
                    currentContent
                })
            });
            
            console.log('Analysis response data:', response);
            setVersions(response.analysis);
            setModalState(MODAL_STATES.ANALYSIS); // Always go to analysis state after generating
            return response.analysis;
        } catch (error) {
            console.error('Error generating versions:', error);
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleGenerateNew = () => {
        setVersions(null);
        setModalState(MODAL_STATES.INITIAL);
    };

    console.log('Current state:', {
        modalState,
        hasVersions: !!versions,
        loading,
        analysisLoading
    });

    // Initial loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Render based on current state
    switch (modalState) {
        case MODAL_STATES.IMPROVED:
            return (
                <SkillsImprovedModal 
                    isOpen={isOpen}
                    onClose={onClose}
                    currentSkills={currentSkills}
                    analysisResults={versions}
                    loading={analysisLoading}
                    onGenerateNew={handleGenerateNew}
                />
            );
        
        case MODAL_STATES.ANALYSIS:
            return (
                <SkillsAnalysisResultModal 
                    isOpen={true}
                    onClose={onClose}
                    analysisResults={versions}
                    currentSkills={currentSkills}
                    loading={analysisLoading}
                    resumeId={resumeId}
                    onGenerateNew={handleGenerateNew}
                />
            );
        
        default:
            return (
                <SkillsAnalysisModal 
                    isOpen={isOpen}
                    onClose={onClose}
                    currentSkills={currentSkills}
                    onImprove={handleImprove}
                    loading={analysisLoading}
                    resumeId={resumeId}
                />
            );
    }
}

export function skillsAnalysisModal({ currentContent, resumeId, onVersionSelect, resumeData }) {
    if (!document) return;
    
    console.log('skillsAnalysisModal called with:', {
        hasCurrentContent: !!currentContent,
        resumeId,
        resumeData
    });
    
    let modalContainer = document.createElement('div');
    modalContainer.id = 'skills-modal-root';
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);
    
    const handleClose = () => {
        root.unmount();
        if (modalContainer.parentNode) {
            modalContainer.parentNode.removeChild(modalContainer);
        }
    };

    root.render(
        <AIAnalysisModal
            isOpen={true}
            currentContent={currentContent}
            onVersionSelect={onVersionSelect}
            onClose={handleClose}
            resumeId={resumeId}
            resumeData={resumeData}
        />
    );
}