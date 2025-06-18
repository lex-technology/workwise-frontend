'use client'

import Modal from '@/components/ui/modal';
import { useState } from 'react';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';
import { useApi } from '@/utils/api';

export default function InitialExperienceModal({ 
    isOpen, 
    onClose, 
    currentExperience,
    resumeId,
    onAnalysisComplete
}) {
    const [loading, setLoading] = useState(false);
    const [analysisStartTime, setAnalysisStartTime] = useState(null);
    const { fetchWithAuth } = useApi();
    

    const handleAnalyze = async () => {
        try {
            setLoading(true);
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
    
            onAnalysisComplete(data);
    
        } catch (error) {
            console.error('Error analyzing experience:', error);
        } finally {
            setLoading(false);
            setAnalysisStartTime(null);
        }
    };

    if (loading) {
        return (
            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
                size="large"
                className="mx-4 sm:mx-6"
            >
                <AnalysisLoadingScreen startTime={analysisStartTime} />
            </Modal>
        );
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="large"
            className="mx-4 sm:mx-6"
        >
            <div className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-white rounded-t-lg">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Experience Analysis</h2>
                    <p className="text-sm text-gray-600 mt-1">Analyze your experience points for improvements</p>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Selected Experience:</h3>
                        
                        <div className="space-y-4 sm:space-y-6">
                            {/* Experience Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <div className="p-3 bg-white rounded-md border">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Role</p>
                                        <p className="text-sm sm:text-base text-gray-900 mt-1">{currentExperience.role}</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-md border">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Organization</p>
                                        <p className="text-sm sm:text-base text-gray-900 mt-1">{currentExperience.organization}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white rounded-md border">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                                        <p className="text-sm sm:text-base text-gray-900 mt-1">{currentExperience.duration}</p>
                                    </div>
                                    {currentExperience.location && (
                                        <div className="p-3 bg-white rounded-md border">
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                                            <p className="text-sm sm:text-base text-gray-900 mt-1">{currentExperience.location}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Experience Points */}
                            {currentExperience.points && currentExperience.points.length > 0 && (
                                <div className="bg-white rounded-lg border p-4 sm:p-5">
                                    <p className="text-sm sm:text-base font-medium text-gray-900 mb-3">Experience Points ({currentExperience.points.length}):</p>
                                    <div className="space-y-3">
                                        {currentExperience.points.map((point, index) => (
                                            <div key={point.id} className="flex gap-3 p-3 bg-gray-50 rounded-md">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {index + 1}
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    {point.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info Banner */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-800">
                                            Our AI will analyze your experience points for relevance, impact, and suggest improvements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 sm:p-6 bg-white rounded-b-lg">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className={`w-full sm:w-auto px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Experience'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 