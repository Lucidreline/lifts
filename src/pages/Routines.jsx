import { useState } from 'react';
import AddRoutineModal from '../components/AddRoutineModal';

function Routines() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [routineToEdit, setRoutineToEdit] = useState(null);

    const handleOpenAddModal = () => {
        setRoutineToEdit(null); // Ensure we're in "add" mode
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRoutineToEdit(null);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Routines</h1>
                <button
                    onClick={handleOpenAddModal}
                    style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px' }}
                >
                    Add Routine
                </button>
            </div>

            <p>Create and manage your workout routines here.</p>

            <AddRoutineModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                routineToEdit={routineToEdit}
            />
        </div>
    );
}

export default Routines;