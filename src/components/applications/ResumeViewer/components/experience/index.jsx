'use client'

import { createRoot } from 'react-dom/client';
import { useApi } from '@/utils/api';
import { useEffect, useState } from 'react';
// Add these imports
import InitialExperienceModal from './InitialExperienceModal';
import ExperienceAnalysisResultModal from './ExperienceAnalysisResultModal';
import ExperienceImprovedModal from './ExperienceImprovedModal';


const ExperienceModalWrapper = ({ resumeId, experienceId, onClose }) => {
    const { fetchWithAuth } = useApi();
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const checkAndRenderExperience = async () => {
            try {
                // First check if analysis exists
                const analysisResponse = await fetchWithAuth(`/api/experience/${experienceId}/analysis`);
                
                // If no analysis, only fetch resume data for initial state
                if (!analysisResponse.analysis) {
                    console.log('No analysis found, fetching resume data for initial view');
                    const resumeData = await fetchWithAuth(`/api/get-resume/${resumeId}`);
                    const experience = resumeData.professional_experience.find(
                        exp => exp.id.toString() === experienceId.toString()
                    );

                    if (!experience) {
                        throw new Error('Experience not found');
                    }

                    setModalContent(
                        <InitialExperienceModal
                            isOpen={true}
                            onClose={onClose}
                            currentExperience={experience}
                            resumeId={resumeId}
                            onAnalysisComplete={(analysisResults) => {
                                setModalContent(
                                    <ExperienceAnalysisResultModal
                                        isOpen={true}
                                        onClose={onClose}
                                        currentExperience={experience}
                                        resumeId={resumeId}
                                        analysisResults={analysisResults}
                                    />
                                );
                            }}
                        />
                    );
                    return;
                }

                // If analysis exists, fetch resume data for full context
                console.log('Analysis found, fetching resume data for analysis view');
                const resumeData = await fetchWithAuth(`/api/get-resume/${resumeId}`);
                const experience = resumeData.professional_experience.find(
                    exp => exp.id.toString() === experienceId.toString()
                );

                if (!experience) {
                    throw new Error('Experience not found');
                }

                if (experience.is_improved === 1 || experience.is_improved === true) {
                    console.log('Experience is improved, showing ImprovedModal');
                    setModalContent(
                        <ExperienceImprovedModal
                            isOpen={true}
                            onClose={onClose}
                            currentExperience={experience}
                            analysisResults={analysisResponse.analysis}
                            onGenerateNew={() => {
                                setModalContent(
                                    <InitialExperienceModal
                                        isOpen={true}
                                        onClose={onClose}
                                        currentExperience={experience}
                                        resumeId={resumeId}
                                        onAnalysisComplete={(newAnalysis) => {
                                            setModalContent(
                                                <ExperienceAnalysisResultModal
                                                    isOpen={true}
                                                    onClose={onClose}
                                                    currentExperience={experience}
                                                    resumeId={resumeId}
                                                    analysisResults={newAnalysis}
                                                />
                                            );
                                        }}
                                    />
                                );
                            }}
                        />
                    );
                } else {
                    setModalContent(
                        <ExperienceAnalysisResultModal
                            isOpen={true}
                            onClose={onClose}
                            currentExperience={experience}
                            resumeId={resumeId}
                            analysisResults={analysisResponse.analysis}
                        />
                    );
                }
            } catch (error) {
                console.error('Error in checkAndRenderExperience:', error);
                onClose();
            }
        };

        checkAndRenderExperience();
    }, [resumeId, experienceId, onClose, fetchWithAuth]);

    return <div id="experience-modal-content">{modalContent}</div>;
};

export const experienceAnalysisModal = (resumeId, experienceId) => {
    console.log('experienceAnalysisModal called with:', { resumeId, experienceId });
    
    let modalRoot = document.getElementById('experience-modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'experience-modal-root';
        document.body.appendChild(modalRoot);
    }

    const handleClose = () => {
        modalRoot.remove();
    };

    const root = createRoot(modalRoot);
    root.render(
        <ExperienceModalWrapper 
            resumeId={resumeId} 
            experienceId={experienceId} 
            onClose={handleClose}
        />
    );
};