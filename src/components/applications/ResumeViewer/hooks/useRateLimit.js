// hooks/useRateLimit.js
import { useState, useRef, useEffect } from 'react';

export function useRateLimit(timeWindow = 5000) { // 5 seconds default
    const [isLimited, setIsLimited] = useState(false);
    const lastCallTime = useRef(0);
    
    const checkRateLimit = () => {
        const now = Date.now();
        if (now - lastCallTime.current < timeWindow) {
            setIsLimited(true);
            return false;
        }
        lastCallTime.current = now;
        return true;
    };

    useEffect(() => {
        if (isLimited) {
            const timer = setTimeout(() => {
                setIsLimited(false);
            }, timeWindow);
            return () => clearTimeout(timer);
        }
    }, [isLimited, timeWindow]);

    return { isLimited, checkRateLimit };
}