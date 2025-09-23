import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { getUserSetsForDateRange } from '../utils/sessionUtils';

export const useWeeklySets = (sessionDate) => {
    const [weeklySets, setWeeklySets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId && sessionDate) {
            setIsLoading(true);
            getUserSetsForDateRange(userId, sessionDate).then(fetchedSets => {
                setWeeklySets(fetchedSets);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [sessionDate]);

    return { weeklySets, isLoading };
};