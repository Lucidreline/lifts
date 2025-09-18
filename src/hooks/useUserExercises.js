import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserExercises } from '../utils/exerciseUtils';

export const useUserExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let exercisesUnsubscribe = () => { }; // Initialize as an empty function

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            // Unsubscribe from any previous user's exercise listener
            exercisesUnsubscribe();

            if (user) {
                // If user is logged in, create a new listener for their exercises
                exercisesUnsubscribe = getUserExercises(user.uid, (fetchedExercises) => {
                    setExercises(fetchedExercises);
                    setIsLoading(false);
                });
            } else {
                // If no user, clear exercises and stop loading
                setExercises([]);
                setIsLoading(false);
            }
        });

        // Cleanup both listeners when the component unmounts
        return () => {
            authUnsubscribe();
            exercisesUnsubscribe();
        };
    }, []);

    return { exercises, isLoading };
};