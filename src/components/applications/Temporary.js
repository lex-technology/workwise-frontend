'use client'

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import SkillsAnalysisModal from './SkillsAnalysisModal';
import SkillsAnalysisResultModal from './SkillsAnalysisResultModal';
import SkillsImprovedModal from './SkillsImprovedModal';
import { useApi } from '@/utils/api';

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
    const [currentSkills, setCurrentSkills] = useState(null);
    const [isImproved, setIsImproved] = useState(false);
    const { fetchWithAuth } = useApi();
    
    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                console.log('Received resumeData:', resumeData); // Debug log
                
                // Safely extract skills data with proper checks
                let skillsData;
                if (resumeData && Array.isArray(resumeData.skills)) {
                    skillsData = resumeData.skills;
                } else if (resumeData && typeof resumeData.skills === 'object') {
                    skillsData = [resumeData.skills];
                } else {
                    // If no skills data, create an empty structure
                    skillsData = [{
                        technical_skills: '',
                        soft_skills: ''
                    }];
                }
                
                // Safely check for improved sections
                const improvedSections = resumeData?.ai_improved_sections || {};
                setIsImproved(improvedSections?.skills === true);

                // Only fetch analysis if needed
                if (!versions) {
                    const analysisResponse = await fetchWithAuth(
                      `http://localhost:8000/api/resume/${resumeId}/skills-analysis`
                    );
                    if (analysisResponse.analysis) {
                        setVersions(analysisResponse.analysis);
                    }
                }
            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && resumeId) {
            initializeData();
        }
    }, [isOpen, resumeId, resumeData]);

    const handleImprove = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth('http://localhost:8000/api/resume/analyze-skills', {
                method: 'POST',
                body: JSON.stringify({
                    resumeId,
                    currentContent
                })
            });
            
            console.log('Analysis response data:', response);
            setVersions(response.analysis);
            return response.analysis;
        } catch (error) {
            console.error('Error generating versions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateNew = () => {
        setVersions(null);
        setIsImproved(false);
    };

    // Determine which modal to show
    if (isImproved && versions) {
        return (
            <SkillsImprovedModal 
                isOpen={isOpen}
                onClose={onClose}
                currentSkills={currentSkills}
                analysisResults={versions}
                loading={loading}
                onGenerateNew={handleGenerateNew}
            />
        );
    } else if (versions) {
        return (
            <SkillsAnalysisResultModal 
                isOpen={true}
                onClose={onClose}
                analysisResults={versions}
                currentSkills={currentSkills}
                loading={loading}
                resumeId={resumeId}
                onGenerateNew={handleGenerateNew}
            />
        );
    } else {
        return (
            <SkillsAnalysisModal 
                isOpen={isOpen}
                onClose={onClose}
                currentSkills={currentSkills}
                onImprove={handleImprove}
                loading={loading}
                resumeId={resumeId}
                resumeData={resumeData}
            />
        );
    }
}

export function skillsAnalysisModal({ currentContent, resumeId, onVersionSelect, resumeData }) {
    if (!document) return;
    
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