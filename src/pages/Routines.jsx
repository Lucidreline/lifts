import { useUserExercises } from '../hooks/useUserExercises';
import AddRoutineModal from '../components/AddRoutineModal';
import { useUserRoutines } from '../hooks/useUserRoutines';
import { deleteRoutine } from '../utils/routineUtils';
import RoutineList from '../components/RoutineList';
import { useState } from 'react';

function Routines() {
    const { routines, isLoading } = useUserRoutines();

    const { exercises: allExercises } = useUserExercises();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [routineToEdit, setRoutineToEdit] = useState(null);

    const handleOpenAddModal = () => {
        setRoutineToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (routine) => {
        setRoutineToEdit(routine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRoutineToEdit(null);
    };

    const handleDeleteRoutine = async (routineId) => {
        if (window.confirm("Are you sure you want to delete this routine?")) {
            await deleteRoutine(routineId);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Routines</h1>
                <button onClick={handleOpenAddModal} style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px' }}>
                    Add Routine
                </button>
            </div>

            {isLoading ? (
                <p>Loading routines...</p>
            ) : (
                <RoutineList
                    routines={routines}
                    onDelete={handleDeleteRoutine}
                    onEdit={handleOpenEditModal}
                />)}

            <AddRoutineModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                routineToEdit={routineToEdit}
                availableExercises={allExercises}
            />
        </div>
    );
}


export default Routines;