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
            if (!selectedPoint) {
                return (
                    <div className="w-full p-6 sm:p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            <p className="text-sm">Select a point to see detailed analysis</p>
                        </div>
                    </div>
                );
            }
    
            const panelClasses = "w-full p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[300px] sm:min-h-[400px]";
    
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
            size="full"
            className="mx-4 sm:mx-6 lg:mx-8"
        >
            <div className="flex flex-col h-[85vh] sm:h-[90vh]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-white rounded-t-lg">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Experience Analysis</h2>
                    <p className="text-sm text-gray-600 mt-1">Review and improve your experience points</p>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Panel - Experience Points */}
                        <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <ExperiencePoints
                                    points={analysisResults.experience_analysis.points_analysis}
                                    activeView={activeView}
                                    getHighlightColor={getHighlightColor}
                                    onPointClick={setSelectedPoint}
                                    modifiedPoints={modifiedPoints}
                                    onDeletePoint={handleDeletePoint}
                                />
                            </div>
                        </div>

                        {/* Right Panel - Analysis Details */}
                        <div className="w-full lg:w-3/5 overflow-y-auto">
                            <div className="p-4 sm:p-6 space-y-4">
                                {/* Analysis Toggle Panel - Make mobile-friendly */}
                                <div className="lg:sticky lg:top-0 bg-white z-10">
                                    <AnalysisTogglePanel
                                        activeView={activeView}
                                        onViewChange={setActiveView}
                                    />
                                </div>
                                
                                {/* Detail Panel */}
                                <div className="space-y-4">
                                    {renderDetailPanel()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with save button */}
                <div className="border-t p-4 sm:p-6 bg-white rounded-b-lg">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="text-sm text-gray-600">
                            {hasUnsavedChanges && (
                                <span className="text-amber-600">You have unsaved changes</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
            </div>
        </Modal>
    );
} 