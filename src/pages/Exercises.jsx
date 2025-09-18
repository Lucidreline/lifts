import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getUserExercises } from '../utils/exerciseUtils';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseList from '../components/ExerciseList'; // Import the new list component

function Exercises() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect runs when the component mounts
        const user = auth.currentUser;
        if (user) {
            // Set up the real-time listener
            const unsubscribe = getUserExercises(user.uid, (fetchedExercises) => {
                setExercises(fetchedExercises);
                setIsLoading(false);
            });

            // Return a cleanup function to unsubscribe when the component unmounts
            return () => unsubscribe();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Exercises</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Add Exercise
                </button>
            </div>

            {/* Conditionally render based on loading state */}
            {isLoading ? (
                <p>Loading exercises...</p>
            ) : (
                <ExerciseList exercises={exercises} />
            )}

            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default Exercises;