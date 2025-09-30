import { useState, useEffect } from 'react';
import { getSession } from '../utils/sessionUtils';

/**
 * A custom hook to fetch a single session document in real-time.
 * @param {string} sessionId - The ID of the session to fetch.
 */
export const useSession = (sessionId) => {
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            setIsLoading(false);
            return;
        };

        const unsubscribe = getSession(sessionId, (sessionData) => {
            setSession(sessionData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [sessionId]); // Re-run if the sessionId changes

    return { session, isLoading };
};