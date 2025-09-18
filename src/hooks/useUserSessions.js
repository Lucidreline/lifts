import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserSessions } from '../utils/sessionUtils';

export const useUserSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let sessionsUnsubscribe = () => { };

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            sessionsUnsubscribe(); // Clean up old listener
            if (user) {
                sessionsUnsubscribe = getUserSessions(user.uid, (fetchedSessions) => {
                    setSessions(fetchedSessions);
                    setIsLoading(false);
                });
            } else {
                setSessions([]);
                setIsLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            sessionsUnsubscribe();
        };
    }, []);

    return { sessions, isLoading };
};