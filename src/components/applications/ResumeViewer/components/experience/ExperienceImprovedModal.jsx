'use client'

import Modal from '@/components/ui/modal';
import { useState } from 'react';

export default function ExperienceImprovedModal({
    isOpen,
    onClose,
    currentExperience,
    analysisResults,
    onGenerateNew
}) {
    const [activePoint, setActivePoint] = useState(null);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            maxWidth="max-w-[150rem]"
            className="w-[110vw]"
        >
            <div className="p-6 max-w-7xl mx-auto">
                {/* Success Banner */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                Your experience points have been optimized with AI suggestions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Experience Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{currentExperience.role}</h2>
                    <p className="text-gray-600">{currentExperience.organization} • {currentExperience.duration}</p>
                    {currentExperience.location && (
                        <p className="text-gray-500">{currentExperience.location}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Current Experience Points */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Optimized Experience Points</h3>
                        <div className="space-y-4">
                            {currentExperience.points.map((point) => (
                                <div 
                                    key={point.id}
                                    className={`p-4 rounded-lg border ${
                                        activePoint?.id === point.id 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-blue-300'
                                    } cursor-pointer transition-colors`}
                                    onClick={() => setActivePoint(point)}
                                >
                                    <p className="text-gray-800">{point.text}</p>
                                    {analysisResults?.experience_analysis?.points_analysis.find(
                                        p => p.point_id === point.id
                                    )?.impact_score && (
                                        <div className="mt-2 flex items-center">
                                            <span className="text-sm font-medium text-gray-500 mr-2">Impact Score:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                getImpactScoreColor(
                                                    analysisResults.experience_analysis.points_analysis.find(
                                                        p => p.point_id === point.id
                                                    ).impact_score
                                                )
                                            }`}>
                                                {(analysisResults.experience_analysis.points_analysis.find(
                                                    p => p.point_id === point.id
                                                ).impact_score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis Insights */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Key Improvements Made</h3>
                        {analysisResults?.experience_analysis?.overall_suggestions && (
                            <div className="space-y-4">
                                {analysisResults.experience_analysis.overall_suggestions.map((suggestion, index) => (
                                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-blue-800">{suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePoint && (
                            <div className="mt-8">
                                <h4 className="text-md font-semibold mb-3">Point-Specific Analysis</h4>
                                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                    {analysisResults?.experience_analysis?.points_analysis.find(
                                        p => p.point_id === activePoint.id
                                    )?.improvement?.suggestions.map((suggestion, index) => (
                                        <p key={index} className="text-gray-700">{suggestion}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        onClick={onGenerateNew}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100"
                    >
                        Generate New Analysis
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function getImpactScoreColor(score) {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
} 