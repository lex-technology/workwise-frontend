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
            size="full"
            className="mx-4 sm:mx-6 lg:mx-8"
        >
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-white rounded-t-lg">
                    {/* Success Banner */}
                    <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
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
                    <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentExperience.role}</h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {currentExperience.organization} • {currentExperience.duration}
                        </p>
                        {currentExperience.location && (
                            <p className="text-sm text-gray-500 mt-1">{currentExperience.location}</p>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            {/* Current Experience Points */}
                            <div className="w-full lg:w-1/2">
                                <h3 className="text-base sm:text-lg font-semibold mb-4">Optimized Experience Points</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {currentExperience.points.map((point) => (
                                        <div 
                                            key={point.id}
                                            className={`p-3 sm:p-4 rounded-lg border ${
                                                activePoint?.id === point.id 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300'
                                            } cursor-pointer transition-colors`}
                                            onClick={() => setActivePoint(point)}
                                        >
                                            <p className="text-sm sm:text-base text-gray-800">{point.text}</p>
                                            {analysisResults?.experience_analysis?.points_analysis.find(
                                                p => p.point_id === point.id
                                            )?.impact_score && (
                                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-500">Impact Score:</span>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                            <div className="w-full lg:w-1/2">
                                <h3 className="text-base sm:text-lg font-semibold mb-4">Key Improvements Made</h3>
                                {analysisResults?.experience_analysis?.overall_suggestions && (
                                    <div className="space-y-3 sm:space-y-4">
                                        {analysisResults.experience_analysis.overall_suggestions.map((suggestion, index) => (
                                            <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                                                <p className="text-sm sm:text-base text-blue-800">{suggestion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activePoint && (
                                    <div className="mt-6 sm:mt-8">
                                        <h4 className="text-sm sm:text-base font-semibold mb-3">Point-Specific Analysis</h4>
                                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-4">
                                            {analysisResults?.experience_analysis?.points_analysis.find(
                                                p => p.point_id === activePoint.id
                                            )?.improvement?.suggestions.map((suggestion, index) => (
                                                <p key={index} className="text-sm sm:text-base text-gray-700">{suggestion}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t p-4 sm:p-6 bg-white rounded-b-lg">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onGenerateNew}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            Generate New Analysis
                        </button>
                    </div>
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