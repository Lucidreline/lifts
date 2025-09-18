import { useState, useEffect, useMemo } from 'react';
import { auth } from '../firebase';
import { getUserExercises, deleteExercise } from '../utils/exerciseUtils';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseList from '../components/ExerciseList';
import ExerciseFilter from '../components/ExerciseFilter';
import splits from '../data/splits.js';
import muscleGroups from '../data/muscleGroups.js';

function Exercises() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        muscleGroup: { simple: '', specific: '' }
    });

    // Effect to fetch exercises in real-time
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const unsubscribe = getUserExercises(user.uid, (fetchedExercises) => {
                setExercises(fetchedExercises);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
            setIsLoading(false);
        }
    }, []);

    // Memoized function to filter exercises when the list or filters change
    const filteredExercises = useMemo(() => {
        return exercises.filter(exercise => {
            const searchLower = filters.search.toLowerCase();
            const nameMatch = exercise.name.toLowerCase().includes(searchLower);
            const categoryMatch = filters.category ? exercise.categories.includes(filters.category) : true;
            const simpleMuscleMatch = filters.muscleGroup.simple
                ? exercise.muscleGroups.primary.simple === filters.muscleGroup.simple ||
                exercise.muscleGroups.secondary.some(m => m.simple === filters.muscleGroup.simple)
                : true;
            const specificMuscleMatch = filters.muscleGroup.specific
                ? exercise.muscleGroups.primary.specific === filters.muscleGroup.specific ||
                exercise.muscleGroups.secondary.some(m => m.specific === filters.muscleGroup.specific)
                : true;
            return nameMatch && categoryMatch && simpleMuscleMatch && specificMuscleMatch;
        });
    }, [exercises, filters]);

    // Handler for deleting an exercise
    const handleDeleteExercise = async (exerciseId) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            await deleteExercise(exerciseId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Exercises</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px' }}
                >
                    Add Exercise
                </button>
            </div>

            <ExerciseFilter
                filters={filters}
                onFilterChange={setFilters}
                muscleGroupsData={muscleGroups}
                splitsData={splits}
            />

            {isLoading ? (
                <p>Loading exercises...</p>
            ) : (
                <ExerciseList
                    exercises={filteredExercises}
                    onDelete={handleDeleteExercise}
                />
            )}

            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default Exercises;