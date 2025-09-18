import { useState, useMemo } from 'react';
import { useUserExercises } from '../hooks/useUserExercises';
import { deleteExercise } from '../utils/exerciseUtils';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseList from '../components/ExerciseList';
import ExerciseFilter from '../components/ExerciseFilter';
import splits from '../data/splits.js';
import muscleGroups from '../data/muscleGroups.js';

function Exercises() {
    const { exercises, isLoading } = useUserExercises();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState(null);
    const [filters, setFilters] = useState({
        search: '', category: '', muscleGroup: { simple: '', specific: '' }
    });

    const filteredExercises = useMemo(() => {
        return exercises.filter(exercise => {
            const searchLower = filters.search.toLowerCase();
            const nameMatch = exercise.name.toLowerCase().includes(searchLower);
            const categoryMatch = filters.category ? exercise.categories.includes(filters.category) : true;
            const simpleMuscleMatch = filters.muscleGroup.simple ? exercise.muscleGroups.primary.simple === filters.muscleGroup.simple || exercise.muscleGroups.secondary.some(m => m.simple === filters.muscleGroup.simple) : true;
            const specificMuscleMatch = filters.muscleGroup.specific ? exercise.muscleGroups.primary.specific === filters.muscleGroup.specific || exercise.muscleGroups.secondary.some(m => m.specific === filters.muscleGroup.specific) : true;
            return nameMatch && categoryMatch && simpleMuscleMatch && specificMuscleMatch;
        });
    }, [exercises, filters]);

    const handleDeleteExercise = async (exerciseId) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            await deleteExercise(exerciseId);
        }
    };

    const handleOpenEditModal = (exercise) => {
        setExerciseToEdit(exercise);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExerciseToEdit(null);
    };

    const handleOpenAddModal = () => {
        setExerciseToEdit(null); // This line ensures the form is empty
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Exercises</h1>
                <button onClick={handleOpenAddModal} style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px' }}>
                    Add Exercise
                </button>
            </div>
            <ExerciseFilter filters={filters} onFilterChange={setFilters} muscleGroupsData={muscleGroups} splitsData={splits} />
            {isLoading ? (<p>Loading exercises...</p>) : (<ExerciseList exercises={filteredExercises} onDelete={handleDeleteExercise} onEdit={handleOpenEditModal} />)}
            <AddExerciseModal isOpen={isModalOpen} onClose={handleCloseModal} exerciseToEdit={exerciseToEdit} />
        </div>
    );
}

export default Exercises;