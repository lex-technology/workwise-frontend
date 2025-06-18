'use client'

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import SkillsAnalysisResultModal from './SkillsAnalysisResultModal';

export default function SkillsAnalysisModal({ isOpen, onClose, currentSkills, onImprove, loading, resumeId }) {
    const [showResults, setShowResults] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    const handleImprove = async () => {
        console.log('SkillsAnalysisModal handleImprove called');
        try {
            setAnalysisLoading(true);
            console.log('Calling onImprove function');
            const result = await onImprove();
            console.log('Got analysis result:', result);
            setAnalysisResults(result);
            setShowResults(true);
        } catch (error) {
            console.error('Error in modal handleImprove:', error);
        } finally {
            setAnalysisLoading(false);
        }
    };

    // If showing results, render the results modal instead
    if (showResults) {
        return (
            <SkillsAnalysisResultModal
                isOpen={true}
                onClose={() => {
                    setShowResults(false);
                    onClose();
                }}
                analysisResults={analysisResults}
                currentSkills={currentSkills}
                loading={analysisLoading}
                resumeId={resumeId}
            />
        );
    }

    // Loading state for initial data fetch or analysis
    if (loading || analysisLoading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm transition ease-in-out duration-150 cursor-not-allowed">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {analysisLoading ? 'Analyzing...' : 'Loading...'}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    // Parse skills and filter out empty ones
    const softSkills = Array.isArray(currentSkills) 
        ? currentSkills[0]?.soft_skills?.split(', ').filter(skill => skill.trim()) || []
        : [];
    
    const technicalSkills = Array.isArray(currentSkills) 
        ? currentSkills[0]?.technical_skills?.split(', ').filter(skill => skill.trim()) || []
        : [];

    const hasSoftSkills = softSkills.length > 0;
    const hasTechnicalSkills = technicalSkills.length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Skills Analysis</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {hasSoftSkills || hasTechnicalSkills 
                            ? "Review your current skills and improve them with AI to better match the job description."
                            : "No skills found. Click 'Improve with AI' to get suggestions based on your experience and job description."}
                    </p>
                </div>

                {/* Skills Lists */}
                <div className="space-y-6">
                    {/* Technical Skills */}
                    {hasTechnicalSkills && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {technicalSkills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Soft Skills - Now using blue instead of green */}
                    {hasSoftSkills && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Soft Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {softSkills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show message if no skills are present */}
                    {!hasSoftSkills && !hasTechnicalSkills && (
                        <div className="text-center py-4 text-gray-500">
                            No skills found. Click &apos;Improve with AI&apos; to get suggestions based on your experience and job description.
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImprove}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Improve with AI
                    </button>
                </div>
            </div>
        </Modal>
    );
}