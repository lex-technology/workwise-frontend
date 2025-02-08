// hooks/useResumeAnalysis.js
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { useApi } from '@/utils/api'

export function useResumeAnalysis(resumeId, resumeData, onAnalysisComplete) {
    const [analysisStatus, setAnalysisStatus] = useState('pending')
    const { supabase } = useAuth()
    const { fetchWithAuth } = useApi()

    // Start analysis
    useEffect(() => {
        if (!resumeId || !resumeData) {
            console.log('Missing required data:', { resumeId, hasResumeData: !!resumeData });
            return;
        }

        const startAnalysis = async () => {
            console.log('Checking analysis status:', resumeData.analysis_status);
            
            if (resumeData.analysis_status === 'completed') {
                console.log('Analysis already completed');
                setAnalysisStatus('completed');
                return;
            }

            try {
                console.log('Starting JD analysis for resume:', resumeId);
                setAnalysisStatus('in_progress');
                
                console.log('Making API call to analyze-jd endpoint');
                const response = await fetchWithAuth(`http://localhost:8000/api/analyze-jd/${resumeId}`, {
                    method: 'POST'
                });
                console.log('JD analysis API response:', response);

                if (response.status === 'success') {
                    console.log('Analysis completed successfully');
                    setAnalysisStatus('completed');
                    if (onAnalysisComplete) {
                        console.log('Calling onAnalysisComplete callback');
                        onAnalysisComplete();
                    }
                }
            } catch (error) {
                console.error('JD analysis error:', error);
                console.error('Full error object:', JSON.stringify(error, null, 2));
                setAnalysisStatus('failed');
            }
        };

        console.log('Initiating analysis process');
        startAnalysis();
    }, [resumeId, resumeData]);

    // Log any status changes
    useEffect(() => {
        console.log('Analysis status changed to:', analysisStatus);
    }, [analysisStatus]);

    return {
        analysisStatus,
        isAnalyzing: analysisStatus === 'pending' || analysisStatus === 'in_progress',
        isComplete: analysisStatus === 'completed',
        isFailed: analysisStatus === 'failed'
    };
}