import { useState, useEffect } from 'react';
import { getSessionSets } from '../utils/sessionUtils';

/**
 * A custom hook to fetch all sets for a specific session in real-time.
 * @param {string} sessionId - The ID of the session to fetch sets for.
 */
export const useSessionSets = (sessionId) => {
    const [sets, setSets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            setIsLoading(false);
            return;
        };

        const unsubscribe = getSessionSets(sessionId, (fetchedSets) => {
            setSets(fetchedSets);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [sessionId]);

    return { sets, isLoading };
};