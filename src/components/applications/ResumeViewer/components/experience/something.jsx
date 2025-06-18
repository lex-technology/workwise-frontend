'use client'

import Modal from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import ExperiencePoints from './ExperiencePoints';
import AnalysisTogglePanel from './AnalysisTogglePanel';
import PointEditPanel from './PointEditPanel';
import RelevanceDetailPanel from './RelevanceDetailPanel';
import RepetitionDetailPanel from './RepetitionDetailPanel';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';
import { updateExperiencePoints } from '../../utils/sectionHandlers';

// The main component
const ExperienceAnalysisModal = ({ 
    isOpen, 
    onClose, 
    currentExperience,
    resumeId,
    existingAnalysis
}) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisStartTime, setAnalysisStartTime] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);
    const [activeView, setActiveView] = useState('repetition');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedPoints, setModifiedPoints] = useState(new Map());
    const [deletedPoints, setDeletedPoints] = useState(new Set());

    console.log('Modal state:', {
        modifiedPointsSize: modifiedPoints.size,
        modifiedPointsEntries: Array.from(modifiedPoints.entries())
    });

    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            setAnalysisError(null);
            setAnalysisStartTime(Date.now());

            console.log('Sending experience for analysis:', {
                resumeId,
                experience: currentExperience,
                points: currentExperience.points // Log points being sent
            });

            const response = await fetch('http://localhost:8000/api/analyze-experience', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeId,
                    experience: {
                        ...currentExperience,
                        points: currentExperience.points.map(point => ({
                            id: point.id,
                            text: point.text
                        }))
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze experience');
            }

            const data = await response.json();
            console.log('Analysis results:', {
                points: data.experience_analysis.points_analysis,
                pointIds: data.experience_analysis.points_analysis.map(p => p.experience_point_id)
            });
            setAnalysisResults(data);
            setActiveView('repetition');

        } catch (error) {
            console.error('Error analyzing experience:', error);
            setAnalysisError(error.message);
        } finally {
            setAnalyzing(false);
            setAnalysisStartTime(null);
        }
    };

    const handlePointUpdate = (point, update) => {
        console.log('handlePointUpdate called:', { 
            pointId: point.point_id,
            update,
            relevanceScore: point.relevance?.score
        });
        
        setModifiedPoints(prev => {
            const newMap = new Map(prev);
            newMap.set(point.point_id, {
                text: update.text,
                relevance_score: point.relevance?.score
            });
            console.log('New modifiedPoints:', newMap);
            return newMap;
        });
        
        if (selectedPoint && selectedPoint.point_id === point.point_id) {
            setSelectedPoint(prev => ({
                ...prev,
                isModified: true,
                original_text: update.text
            }));
        }
        
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        try {
            // Create a map of all points with their text and relevance scores
            const allPointsWithScores = new Map();
            
            // First, add ALL points from analysis with their original text and relevance scores
            analysisResults.experience_analysis.points_analysis.forEach(point => {
                if (!deletedPoints.has(point.point_id)) {
                    allPointsWithScores.set(point.point_id, {
                        text: point.original_text || point.text, // Use original text as base
                        relevance_score: point.relevance?.score
                    });
                }
            });

            // Then overlay any modified points
            modifiedPoints.forEach((value, key) => {
                const existingPoint = allPointsWithScores.get(key) || {};
                allPointsWithScores.set(key, {
                    text: value.text || existingPoint.text, // Use modified text if available
                    relevance_score: value.relevance_score || existingPoint.relevance_score
                });
            });

            console.log('Saving all points:', {
                totalPoints: allPointsWithScores.size,
                points: Array.from(allPointsWithScores.entries()).map(([id, data]) => ({
                    id,
                    text: data.text,
                    relevance_score: data.relevance_score
                }))
            });

            const result = await updateExperiencePoints(
                resumeId,
                currentExperience.id,
                {
                    modifiedPoints: allPointsWithScores,
                    deletedPoints
                }
            );

            console.log('Save result:', result);

            if (result.experience_improved) {
                window.location.reload();
            }

            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const getHighlightColor = (score) => {
        if (score >= 0.7) return 'bg-green-100';
        if (score >= 0.4) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const handleSortByRelevance = () => {
        if (!analysisResults?.experience_analysis?.points_analysis) return;

        const sortedPoints = [...analysisResults.experience_analysis.points_analysis].sort((a, b) => {
            // Handle cases where points might not have relevance scores
            const scoreA = a.relevance?.score ?? 0;
            const scoreB = b.relevance?.score ?? 0;
            return scoreB - scoreA; // Sort in descending order
        });

        console.log('Sorting points by relevance:', {
            originalOrder: analysisResults.experience_analysis.points_analysis.map(p => p.relevance?.score),
            newOrder: sortedPoints.map(p => p.relevance?.score)
        });

        setAnalysisResults(prev => ({
            ...prev,
            experience_analysis: {
                ...prev.experience_analysis,
                points_analysis: sortedPoints
            }
        }));
    };

    const handleDeletePoint = async (point) => {
        try {
            console.log('Deleting point:', point);
            setDeletedPoints(prev => new Set([...prev, point.point_id]));
            
            setAnalysisResults(prev => ({
                ...prev,
                experience_analysis: {
                    ...prev.experience_analysis,
                    points_analysis: prev.experience_analysis.points_analysis.filter(
                        p => p.point_id !== point.point_id
                    )
                }
            }));

            if (selectedPoint?.point_id === point.point_id) {
                setSelectedPoint(null);
            }
        } catch (error) {
            console.error('Error deleting point:', error);
        }
    };

    const renderDetailPanel = () => {
        if (!selectedPoint) return null;

        const panelClasses = "w-full p-6 bg-white rounded-lg shadow-sm min-h-[500px] mt-4";

        switch (activeView) {
            case 'impact':
                return (
                    <div className={panelClasses}>
                        <div className="space-y-4">
                            <PointEditPanel
                                point={selectedPoint}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                onApply={handlePointUpdate}
                                modifiedPoints={modifiedPoints}
                            />
                        </div>
                    </div>
                );
            case 'relevance':
                return (
                    <div className={panelClasses}>
                        <div className="space-y-4">
                            <RelevanceDetailPanel
                                point={selectedPoint}
                                onSortByRelevance={handleSortByRelevance}
                            />
                        </div>
                    </div>
                );
            case 'repetition':
                return (
                    <div className={panelClasses}>
                        <div className="space-y-4">
                            <RepetitionDetailPanel point={selectedPoint} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const hasUnsavedChanges = modifiedPoints.size > 0 || deletedPoints.size > 0;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            maxWidth="max-w-[150rem]"
            className="w-[110vw]"
        >
            {analyzing ? (
                <AnalysisLoadingScreen startTime={analysisStartTime} />
            ) : (
                <div className="flex flex-col h-[90vh]">
                    <div className="p-6 flex-grow overflow-auto">
                        <h2 className="text-2xl font-bold mb-4">Experience Analysis</h2>
                        
                        {!analysisResults && currentExperience && (
                            <div className="mb-6 p-4 bg-gray-50 rounded">
                                <h3 className="text-lg font-semibold mb-2">Selected Experience:</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p><strong>Role:</strong> {currentExperience.role}</p>
                                        <p><strong>Organization:</strong> {currentExperience.organization}</p>
                                        <p><strong>Duration:</strong> {currentExperience.duration}</p>
                                        {currentExperience.location && (
                                            <p><strong>Location:</strong> {currentExperience.location}</p>
                                        )}
                                    </div>

                                    {currentExperience.organization_description && (
                                        <div>
                                            <p className="font-medium">Organization Description:</p>
                                            <p className="text-gray-600">
                                                {currentExperience.organization_description}
                                            </p>
                                        </div>
                                    )}

                                    {currentExperience.points && currentExperience.points.length > 0 && (
                                        <div>
                                            <p className="font-medium mb-2">Experience Points:</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                {currentExperience.points.map((point) => (
                                                    <li key={point.id} className="text-gray-600">
                                                        {point.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAnalyze}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Analyze Experience
                                    </button>
                                </div>
                            </div>
                        )}

                        {analysisResults && (
                            <div className="flex gap-12">
                                <div className="w-[40%]">
                                    <ExperiencePoints
                                        points={analysisResults.experience_analysis.points_analysis}
                                        activeView={activeView}
                                        getHighlightColor={getHighlightColor}
                                        onPointClick={setSelectedPoint}
                                        modifiedPoints={modifiedPoints}
                                        onDeletePoint={handleDeletePoint}
                                    />
                                </div>

                                <div className="w-[60%]">
                                    <div className="sticky top-4 space-y-4">
                                        <AnalysisTogglePanel
                                            activeView={activeView}
                                            onViewChange={setActiveView}
                                        />
                                        {renderDetailPanel()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with save button */}
                    <div className="border-t p-4 bg-white">
                        <div className="flex justify-end items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {hasUnsavedChanges 
                                    ? `${modifiedPoints.size + deletedPoints.size} unsaved changes` 
                                    : 'No changes made'}
                            </span>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    hasUnsavedChanges
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

// The function that gets called from handleExperienceClick
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

    const fetchAndRenderExperience = async () => {
        try {
            // Fetch resume data
            const resumeResponse = await fetch(`http://localhost:8000/api/get-resume/${resumeId}`);
            if (!resumeResponse.ok) throw new Error('Failed to fetch resume');
            const resumeData = await resumeResponse.json();

            // Filter for the specific experience
            const experience = resumeData.professional_experience.find(
                exp => exp.id.toString() === experienceId.toString()
            );

            if (!experience) {
                throw new Error('Experience not found');
            }

            console.log('Found experience:', experience);

            // Check for existing analysis
            const analysisResponse = await fetch(`http://localhost:8000/api/experience/${experienceId}/analysis`);
            const analysisData = await analysisResponse.json();
            
            console.log('Fetched analysis data:', analysisData);

            // Simplified check for analysis existence
            const hasAnalysis = analysisData && analysisData.analysis;

            console.log('Analysis to be passed:', hasAnalysis ? analysisData.analysis : null);

            const { createRoot } = require('react-dom/client');
            const root = createRoot(modalRoot);
            root.render(
                <ExperienceAnalysisModal
                    isOpen={true}
                    onClose={handleClose}
                    currentExperience={experience}
                    resumeId={resumeId}
                    existingAnalysis={hasAnalysis ? analysisData.analysis : null}
                    initialView={!hasAnalysis}
                />
            );
        } catch (error) {
            console.error('Error fetching experience:', error);
            modalRoot.remove();
        }
    };

    fetchAndRenderExperience();
};

// Export both for flexibility
export { ExperienceAnalysisModal };