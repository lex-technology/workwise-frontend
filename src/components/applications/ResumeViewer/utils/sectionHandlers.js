'use client'

import { execSummaryAnalysisModal } from '../components/exec_summary/index';
import { skillsAnalysisModal } from '../components/skills/index';
import toast from 'react-hot-toast';
import { experienceAnalysisModal } from '../components/experience/index';

export function handleSectionClick(sectionTitle, resumeData, refreshData) {
    const sectionElement = document.querySelector(`[data-section="${sectionTitle}"]`);
    const sectionContent = sectionElement?.innerHTML || '';
    
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');
    
    const sectionToColumnMap = {
        'Executive Summary': 'executive_summary',
        'Skills': 'skills',
        // Add other mappings as needed
    };

    console.log('handleSectionClick resumeData:', resumeData);
    // Handle different sections
    if (sectionTitle === 'Skills') {
        console.log('Calling skillsAnalysisModal with:', { 
            sectionContent, 
            resumeId, 
            resumeData 
        });
        skillsAnalysisModal({
            currentContent: sectionContent,
            resumeId: resumeId,
            resumeData,
            onVersionSelect: async (newContent) => {
                await updateSection(resumeId, 'skills', newContent);
            }
        });
    } else if (sectionTitle === 'Executive Summary') {
        execSummaryAnalysisModal({
            sectionTitle,
            currentContent: resumeData.executive_summary,
            resumeId: resumeId,
            resumeData,
            refreshData,
            onVersionSelect: async (newContent) => {
                await updateSection(resumeId, 'executive_summary', newContent);
            }
        });
    }
}

export async function updateSection(resumeId, sectionTitle, newContent) {
    const loadingToast = toast.loading('Saving changes...');
    
    try {
        const response = await fetch('/api/resume/update-section', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resumeId: resumeId,
                sectionTitle: sectionTitle,
                content: newContent
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update content: ${response.status} ${response.statusText}`);
        }

        toast.success('Changes saved successfully!', {
            id: loadingToast,
            duration: 1000,
        });

        // Invalidate the cache
        const cacheKey = `resume_${resumeId}`;
        sessionStorage.removeItem(cacheKey);
       
        // Force a data refresh
        window.location.reload();

    } catch (error) {
        console.error('Error updating content:', error);
        toast.error(`Failed to save changes: ${error.message}`, {
            id: loadingToast,
            duration: 3000
        });
    }
}

export const handleExperienceClick = async (resumeId, experienceId) => {
    console.log('Handling experience click with:', { resumeId, experienceId });

    if (!experienceId) {
        console.error('No experienceId provided to handleExperienceClick');
        return;
    }

    try {
        // Launch the experience analysis modal
        experienceAnalysisModal(resumeId, experienceId);

    } catch (error) {
        console.error('Error in handleExperienceClick:', error);
    }
};

export async function updateExperiencePoints(resumeId, experienceId, changes) {
    const loadingToast = toast.loading('Saving changes...');
    
    try {
        // Log the incoming data
        console.log('Raw incoming data:', {
            changes,
            modifiedPointsEntries: Array.from(changes.modifiedPoints.entries())
        });

        // Convert the Map to an array of points with all necessary data
        const allPoints = Array.from(changes.modifiedPoints.entries()).map(([pointId, data]) => {
            // Log each point transformation
            console.log('Processing point:', { pointId, data });
            
            const transformedPoint = {
                point_id: pointId,
                new_text: data.text,
                relevance_score: data.relevance_score
            };
            
            console.log('Transformed point:', transformedPoint);
            return transformedPoint;
        });

        const requestBody = {
            resumeId,
            experienceId,
            modifiedPoints: allPoints,
            deletedPoints: Array.from(changes.deletedPoints)
        };

        console.log('Final request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('/api/resume/update-experience-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Failed to update experience points: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Update response:', result);

        toast.success('Changes saved successfully!', {
            id: loadingToast,
            duration: 1000,
        });

        return result;

    } catch (error) {
        console.error('Error updating experience points:', error);
        toast.error(`Failed to save changes: ${error.message}`, {
            id: loadingToast,
            duration: 3000
        });
        throw error;
    }
}

// You can reuse the existing ImprovementModal component
// Reference to ImprovementModal.js:
