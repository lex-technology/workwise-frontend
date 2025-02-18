'use client'

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from '@/components/ui/modal';
import QuestionnaireView from './QuestionnaireView';
import AnalysisResultsView from './AnalysisResultsView';
import { useApi } from '@/utils/api';
import { toast } from 'sonner';

// Cache utilities
const getCacheKey = (resumeId) => `summary_analysis_${resumeId}`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCache = (resumeId) => {
    try {
        const cached = sessionStorage.getItem(getCacheKey(resumeId));
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            sessionStorage.removeItem(getCacheKey(resumeId));
            return null;
        }

        return data;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
};

const setCache = (resumeId, data) => {
    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        sessionStorage.setItem(getCacheKey(resumeId), JSON.stringify(cacheData));
    } catch (error) {
        console.error('Cache write error:', error);
    }
};

// Global fetch state map
const fetchingStates = new Map();

function AIAnalysisModal({ 
    isOpen, 
    onClose, 
    sectionTitle, 
    currentContent,
    onVersionSelect,
    resumeId
}) {
    const [versions, setVersions] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchWithAuth } = useApi();

    const fetchAnalysis = async () => {
        try {
            // Check ongoing fetches
            if (fetchingStates.has(resumeId)) {
                return await fetchingStates.get(resumeId);
            }

            // Check cache
            const cachedData = getCache(resumeId);
            if (cachedData) {
                return { analysis: cachedData };
            }

            // Make new fetch request
            const fetchPromise = fetchWithAuth(`/api/resume/${resumeId}/summary-analysis`);
            fetchingStates.set(resumeId, fetchPromise);

            const data = await fetchPromise;
            
            if (data.analysis) {
                setCache(resumeId, data.analysis);
            }

            fetchingStates.delete(resumeId);
            return data;
        } catch (error) {
            fetchingStates.delete(resumeId);
            throw error;
        }
    };
    
    useEffect(() => {
        const initializeAnalysis = async () => {
            if (!isOpen || !resumeId) return;
            
            try {
                setLoading(true);
                const data = await fetchAnalysis();
                if (data?.analysis) {
                    setVersions(data.analysis);
                }
            } catch (error) {
                console.error('Error fetching analysis:', error);
                if (error.message.includes('402')) {
                    toast.error('Insufficient credits for analysis. Please purchase more credits.');
                } else {
                    toast.error('Failed to fetch analysis. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAnalysis();
    }, [isOpen, resumeId]);

    const handleSubmitQuestionnaire = async (answers) => {
        try {
            setLoading(true);
            const data = await fetchWithAuth('/api/resume/analyze-executive-summary', {
                method: 'POST',
                body: JSON.stringify({
                    resumeId,
                    answers,
                    currentContent
                })
            });
            
            if (data.analysis) {
                setVersions(data.analysis);
                setCache(resumeId, data.analysis);
            }
        } catch (error) {
            console.error('Error generating versions:', error);
            if (error.message.includes('402')) {
                toast.error('Insufficient credits for analysis. Please purchase more credits.');
            } else {
                toast.error('Failed to generate analysis. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateNew = () => {
        setVersions(null);
        sessionStorage.removeItem(getCacheKey(resumeId));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">
                    AI Analyzer: {sectionTitle}
                </h2>
                
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading analysis...</span>
                    </div>
                ) : versions ? (
                    <AnalysisResultsView 
                        versions={versions}
                        onClose={onClose}
                        onVersionSelect={onVersionSelect}
                        currentContent={currentContent}
                        onGenerateNew={handleGenerateNew}
                    />
                ) : (
                    <QuestionnaireView 
                        sectionTitle={sectionTitle}
                        onSubmit={handleSubmitQuestionnaire}
                    />
                )}
            </div>
        </Modal>
    );
}

export function execSummaryAnalysisModal({ 
    sectionTitle, 
    currentContent, 
    onVersionSelect,
    resumeId
}) {
    if (!document) return;
    
    let modalContainer = document.createElement('div');
    modalContainer.id = 'ai-analysis-modal-root';
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);
    
    const handleClose = () => {
        root.unmount();
        if (modalContainer.parentNode) {
            modalContainer.parentNode.removeChild(modalContainer);
        }
    };

    root.render(
        <AIAnalysisModal
            isOpen={true}
            sectionTitle={sectionTitle}
            currentContent={currentContent}
            onVersionSelect={onVersionSelect}
            onClose={handleClose}
            resumeId={resumeId}
        />
    );
}