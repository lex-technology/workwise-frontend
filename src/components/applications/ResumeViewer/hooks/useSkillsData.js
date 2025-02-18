// hooks/useSkillsData.js
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useApi } from '@/utils/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSkillsData(resumeData, resumeId) {
  const [state, setState] = useState({
    currentSkills: null,
    analysisResults: null,
    isLoading: false,
    isError: false,
    isImproved: false
  });
  
  const { getToken } = useAuth();
  const { fetchWithAuth } = useApi();

  const getCacheKey = (id) => `skills_analysis_${id}`;

  const getCachedData = () => {
    try {
      const cachedString = sessionStorage.getItem(getCacheKey(resumeId));
      if (!cachedString) return null;

      const cached = JSON.parse(cachedString);
      if (Date.now() - cached.timestamp > CACHE_DURATION) {
        console.log('Cache expired, removing old data');
        sessionStorage.removeItem(getCacheKey(resumeId));
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedData = (data) => {
    try {
      sessionStorage.setItem(
        getCacheKey(resumeId), 
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  // Initialize data effect
  useEffect(() => {
    if (resumeData?.skills) {
      const currentSkills = resumeData.skills[0] || { technical_skills: '', soft_skills: '' };
      const isImproved = resumeData.ai_improved_sections?.skills || false;
      
      setState(prev => ({
        ...prev,
        currentSkills,
        isImproved
      }));
    }
  }, [resumeData?.skills]);

  // Check cache effect
  useEffect(() => {
    if (resumeId) {
      const cachedAnalysis = getCachedData();
      if (cachedAnalysis) {
        setState(prev => ({
          ...prev,
          analysisResults: cachedAnalysis
        }));
      }
    }
  }, [resumeId]);

  const fetchAnalysis = async (skipCache = false) => {
    if (!resumeId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      if (!skipCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setState(prev => ({
            ...prev,
            analysisResults: cachedData,
            isLoading: false
          }));
          return cachedData;
        }
      }

      const response = await fetchWithAuth(
        `/api/resume/${resumeId}/skills-analysis`
      );

      if (response.analysis) {
        setCachedData(response.analysis);
        setState(prev => ({
          ...prev,
          analysisResults: response.analysis,
          isError: false
        }));
        return response.analysis;
      }

    } catch (error) {
      console.error('Error fetching skills analysis:', error);
      setState(prev => ({ ...prev, isError: true }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const improveSkills = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetchWithAuth(
        '/api/resume/analyze-skills',
        {
          method: 'POST',
          body: JSON.stringify({
            resumeId,
            currentSkills: state.currentSkills
          })
        }
      );

      if (response.analysis) {
        setCachedData(response.analysis);
        setState(prev => ({
          ...prev,
          analysisResults: response.analysis,
          isImproved: true,
          isError: false
        }));
        return response.analysis;
      }

    } catch (error) {
      console.error('Error improving skills:', error);
      setState(prev => ({ ...prev, isError: true }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetAnalysis = () => {
    sessionStorage.removeItem(getCacheKey(resumeId));
    setState(prev => ({
      ...prev,
      analysisResults: null,
      isImproved: false
    }));
  };

  return {
    ...state,
    fetchAnalysis,
    improveSkills,
    resetAnalysis
  };
}