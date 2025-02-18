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
            <Modal isOpen={isOpen} onClose={onClose}>
                <AnalysisLoadingScreen startTime={analysisStartTime} />
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Experience Analysis</h2>
                
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
                            disabled={loading}
                            className={`mt-4 px-4 py-2 ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white rounded-lg`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Experience'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 