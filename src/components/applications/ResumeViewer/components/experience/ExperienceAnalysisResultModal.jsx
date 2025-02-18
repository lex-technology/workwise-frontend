'use client'

import Modal from '@/components/ui/modal';
import { useState } from 'react';
import ExperiencePoints from './ExperiencePoints';
import AnalysisTogglePanel from './AnalysisTogglePanel';
import PointEditPanel from './PointEditPanel';
import RelevanceDetailPanel from './RelevanceDetailPanel';
import RepetitionDetailPanel from './RepetitionDetailPanel';
import { updateExperiencePoints } from '../../utils/sectionHandlers';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';
import { useApi } from '@/utils/api';

export default function ExperienceAnalysisResultModal({ 
    isOpen, 
    onClose, 
    currentExperience,
    resumeId,
    analysisResults: initialAnalysisResults
}) {
    const [activeView, setActiveView] = useState('repetition');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedPoints, setModifiedPoints] = useState(new Map());
    const [deletedPoints, setDeletedPoints] = useState(new Set());
    const [analysisResults, setAnalysisResults] = useState(initialAnalysisResults);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisStartTime, setAnalysisStartTime] = useState(null);
    const { fetchWithAuth } = useApi();
  
    

    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            setAnalysisStartTime(Date.now());
            
    
            const data = await fetchWithAuth('/api/analyze-experience', {
                method: 'POST',
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
                const scoreA = a.relevance?.score ?? 0;
                const scoreB = b.relevance?.score ?? 0;
                return scoreB - scoreA;
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
            <div className="flex flex-col h-[90vh]">
                <div className="p-6 flex-grow overflow-auto">
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
                </div>

                {/* Footer with save button */}
                <div className="border-t p-4 bg-white">
                    <div className="flex justify-end items-center gap-4">
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
        </Modal>
    );
} 