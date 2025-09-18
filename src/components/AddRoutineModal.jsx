// src/components/AddRoutineModal.jsx

function AddRoutineModal({ isOpen, onClose, routineToEdit }) {
    const isEditMode = Boolean(routineToEdit);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#2d3748', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {isEditMode ? 'Edit Routine' : 'Add a New Routine'}
                    </h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem' }}>&times;</button>
                </div>

                <p>Routine form will go here...</p>

            </div>
        </div>
    );
}

export default AddRoutineModal;