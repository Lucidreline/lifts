import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserRoutines } from '../utils/routineUtils';

/**
 * A custom hook to fetch routines for the current user in real-time.
 */
export const useUserRoutines = () => {
    const [routines, setRoutines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let routinesUnsubscribe = () => { };

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            routinesUnsubscribe();

            if (user) {
                routinesUnsubscribe = getUserRoutines(user.uid, (fetchedRoutines) => {
                    setRoutines(fetchedRoutines);
                    setIsLoading(false);
                });
            } else {
                setRoutines([]);
                setIsLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            routinesUnsubscribe();
        };
    }, []);

    return { routines, isLoading };
};