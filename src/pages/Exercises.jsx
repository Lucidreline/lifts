import { useState, useEffect, useMemo } from 'react'; // 1. Import useMemo
import { auth } from '../firebase';
import { getUserExercises } from '../utils/exerciseUtils';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseList from '../components/ExerciseList';
import ExerciseFilter from '../components/ExerciseFilter';
import splits from '../data/splits.js';
import muscleGroups from '../data/muscleGroups.js';

function Exercises() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]); // This is the master list
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        muscleGroup: { simple: '', specific: '' }
    });

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

    // 2. This is our new filtering logic
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
    }, [exercises, filters]); // 3. This array tells the hook when to re-run

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

            <ExerciseFilter
                filters={filters}
                onFilterChange={setFilters}
                muscleGroupsData={muscleGroups}
                splitsData={splits}
            />

            {isLoading ? (
                <p>Loading exercises...</p>
            ) : (
                // 4. We pass the filtered list to the component
                <ExerciseList exercises={filteredExercises} />
            )}

            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default Exercises;