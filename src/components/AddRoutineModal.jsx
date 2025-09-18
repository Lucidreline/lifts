import { useState, useMemo } from 'react';
import splits from '../data/splits.js'; // We'll use this for the category options

function AddRoutineModal({ isOpen, onClose, routineToEdit, availableExercises }) {
    const isEditMode = Boolean(routineToEdit);

    // --- FORM STATE ---
    const [routineName, setRoutineName] = useState('');
    const [routineCategories, setRoutineCategories] = useState([]);
    const [exerciseToAdd, setExerciseToAdd] = useState(''); // Tracks the dropdown selection
    const [selectedExercises, setSelectedExercises] = useState([]); // The list of exercises in the routine

    // --- HANDLERS ---
    const handleCategoryClick = (category) => {
        setRoutineCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };

    const handleExerciseDropdownChange = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return; // Ignore the default "Select..." option

        const exerciseObject = availableExercises.find(ex => ex.id === selectedId);
        if (exerciseObject) {
            setSelectedExercises([...selectedExercises, exerciseObject]);
        }

        // Reset the dropdown back to the default option
        setExerciseToAdd('');
    };

    const handleAddExercise = () => {
        if (!exerciseToAdd) return; // Don't add if nothing is selected
        const exerciseObject = availableExercises.find(ex => ex.id === exerciseToAdd);
        if (exerciseObject) {
            setSelectedExercises([...selectedExercises, exerciseObject]);
        }
        setExerciseToAdd(''); // Reset dropdown
    };

    // --- FILTERING LOGIC ---
    // This filters the main exercise list based on the selected categories
    const filteredExercisesForDropdown = useMemo(() => {
        if (routineCategories.length === 0) {
            return availableExercises; // If no categories selected, show all exercises
        }
        return availableExercises.filter(ex =>
            // Check if any of the exercise's categories are in the selected routine categories
            ex.categories.some(cat => routineCategories.includes(cat))
        );
    }, [routineCategories, availableExercises]);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#2d3748', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditMode ? 'Edit Routine' : 'Add a New Routine'}</h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem' }}>&times;</button>
                </div>

                <form style={{ flex: 1, overflowY: 'auto' }}>
                    {/* Routine Name */}
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="routine-name">Routine Name *</label>
                        <input id="routine-name" type="text" value={routineName} onChange={(e) => setRoutineName(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }} />
                    </div>

                    {/* Routine Categories */}
                    <div style={{ marginBottom: '16px' }}>
                        <label>Categories *</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {splits.map((split) => (<button key={split} type="button" onClick={() => handleCategoryClick(split)} style={{ padding: '8px', border: '1px solid #4a5568', borderRadius: '8px', backgroundColor: routineCategories.includes(split) ? '#4299e1' : 'transparent', color: 'white' }}>{split}</button>))}
                        </div>
                    </div>

                    {/* Add Exercise Section */}
                    <div style={{ marginBottom: '16px' }}>
                        <label>Add Exercise</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <select
                                value={exerciseToAdd}
                                onChange={handleExerciseDropdownChange} // Use the new handler
                                style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
                            >
                                <option value="">Select an exercise to add...</option>
                                {filteredExercisesForDropdown.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                            </select>
                            {/* The "Add" button has been removed */}
                        </div>
                    </div>

                    {/* Selected Exercises List */}
                    <div>
                        <label>Exercises in Routine</label>
                        <div style={{ marginTop: '8px', border: '1px solid #4a5568', borderRadius: '4px', minHeight: '100px', padding: '8px' }}>
                            {selectedExercises.map((ex, index) => (
                                <div key={`${ex.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#4a5568', borderRadius: '4px', marginBottom: '8px' }}>
                                    <span>{ex.name}</span>
                                    {/* Reorder/Delete buttons will go here */}
                                </div>
                            ))}
                            {selectedExercises.length === 0 && <p style={{ color: '#a0aec0', textAlign: 'center' }}>No exercises added yet.</p>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoutineModal;