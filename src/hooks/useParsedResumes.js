// hooks/useParsedResumes.js
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

const CACHE_KEY = 'cached_parsed_resumes';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useParsedResumes = () => {
    const { getToken } = useAuth();
    const [parsedResumes, setParsedResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                console.log('Fetching parsed resumes...');
                
                // Check cache
                const cachedData = sessionStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const age = Date.now() - timestamp;
                    console.log('Found cached data:', {
                        dataLength: data.length,
                        ageInMinutes: Math.round(age / 60000)
                    });
                    
                    if (age < CACHE_DURATION) {
                        console.log('Using cached data');
                        setParsedResumes(data);
                        setIsLoading(false);
                        return;
                    }
                    console.log('Cache expired, fetching fresh data');
                }

                const token = getToken();
                console.log('Making API request...');
                
                const response = await fetch('http://localhost:8000/api/parsed-resumes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error:', errorText);
                    throw new Error(`Failed to fetch parsed resumes: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Received data:', {
                    count: data.length,
                    sampleId: data[0]?.id,
                    timestamp: new Date().toISOString()
                });
                
                // Update cache
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
                console.log('Updated cache');

                setParsedResumes(data);
            } catch (err) {
                console.error('Error in useParsedResumes:', err);
                console.error('Full error:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumes();
    }, [getToken]);

    // Force refresh function
    const refreshResumes = async () => {
        setIsLoading(true);
        sessionStorage.removeItem(CACHE_KEY);
        try {
            const token = getToken();
            const response = await fetch('http://localhost:8000/api/parsed-resumes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch parsed resumes');
            }

            const data = await response.json();
            
            // Update cache
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));

            setParsedResumes(data);
        } catch (err) {
            console.error('Error refreshing parsed resumes:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        parsedResumes,
        isLoading,
        error,
        refreshResumes
    };
};