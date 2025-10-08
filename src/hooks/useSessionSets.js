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
            const sortedSets = [...fetchedSets].sort((a, b) => {
                const aHasOrder = a.order !== undefined && a.order !== null;
                const bHasOrder = b.order !== undefined && b.order !== null;

                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;

                // If both sets have an 'order' field AND were created within 5 seconds of each other...
                // This is a much safer window to identify a single routine batch.
                if (aHasOrder && bHasOrder && Math.abs(timeA - timeB) < 5000) {
                    return a.order - b.order; // ...sort them by their intended routine order.
                }

                // For all other cases, sort by time, newest first.
                return timeB - timeA;
            });

            setSets(sortedSets);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [sessionId]);

    return { sets, isLoading };
};