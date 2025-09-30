import { useState, useMemo, useEffect } from 'react';
import { auth } from '../firebase'; // This import was missing
import { addRoutineToFirestore, updateRoutine } from '../utils/routineUtils'; // This import was missing
import splits from '../data/splits.js';

function AddRoutineModal({ isOpen, onClose, routineToEdit, availableExercises }) {
    const isEditMode = Boolean(routineToEdit);

    const [routineName, setRoutineName] = useState('');
    const [routineCategories, setRoutineCategories] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [exerciseToAdd, setExerciseToAdd] = useState('');

    // Effect to reset the form when the modal is opened
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && routineToEdit) {
                // Pre-fill fields with existing routine data
                setRoutineName(routineToEdit.name);
                setRoutineCategories(routineToEdit.categories);

                // Find the full exercise objects based on the IDs stored in the routine
                const exercisesInRoutine = routineToEdit.exercises.map(id =>
                    availableExercises.find(ex => ex.id === id)
                ).filter(Boolean); // Filter out any undefined exercises
                setSelectedExercises(exercisesInRoutine);

            } else {
                // Reset all fields for "add" mode
                setRoutineName('');
                setRoutineCategories([]);
                setSelectedExercises([]);
                setExerciseToAdd('');
            }
        }
    }, [isOpen, isEditMode, routineToEdit, availableExercises]);


    const handleCategoryClick = (category) => {
        setRoutineCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };

    const handleExerciseDropdownChange = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;
        const exerciseObject = availableExercises.find(ex => ex.id === selectedId);
        if (exerciseObject) {
            setSelectedExercises([...selectedExercises, exerciseObject]);
        }
        setExerciseToAdd('');
    };

    const handleRemoveExercise = (indexToRemove) => {
        setSelectedExercises(selectedExercises.filter((_, index) => index !== indexToRemove));
    };

    const handleReorderExercise = (index, direction) => {
        const newList = [...selectedExercises];
        const item = newList[index];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        newList.splice(index, 1);
        newList.splice(newIndex, 0, item);
        setSelectedExercises(newList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormInvalid) return;
        const routineData = { routineName, routineCategories, selectedExercises };

        const result = isEditMode
            ? await updateRoutine(routineToEdit.id, routineData)
            : await addRoutineToFirestore(routineData, auth.currentUser.uid);

        if (result.success) {
            onClose();
        } else {
            alert(`Failed to ${isEditMode ? 'update' : 'create'} routine.`);
        }
    };

    const filteredExercisesForDropdown = useMemo(() => {
        if (routineCategories.length === 0) return availableExercises;
        return availableExercises.filter(ex => ex.categories.some(cat => routineCategories.includes(cat)));
    }, [routineCategories, availableExercises]);

    if (!isOpen) return null;
    const isFormInvalid = !routineName || routineCategories.length === 0 || selectedExercises.length === 0;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#2d3748', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditMode ? 'Edit Routine' : 'Add a New Routine'}</h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem' }}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto' }}>
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
                                onChange={handleExerciseDropdownChange}
                                style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
                            >
                                <option value="">Select an exercise to add...</option>
                                {filteredExercisesForDropdown.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Selected Exercises List */}
                    <div>
                        <label>Exercises in Routine</label>
                        <div style={{ marginTop: '8px', border: '1px solid #4a5568', borderRadius: '4px', minHeight: '100px', padding: '8px' }}>
                            {selectedExercises.map((ex, index) => (
                                <div key={`${ex.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#4a5568', borderRadius: '4px', marginBottom: '8px' }}>
                                    <span>{ex.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button type="button" onClick={() => handleReorderExercise(index, 'up')} disabled={index === 0} style={{ border: 'none', background: 'none', color: index === 0 ? '#718096' : 'white', cursor: 'pointer' }}>&#x25B2;</button>
                                        <button type="button" onClick={() => handleReorderExercise(index, 'down')} disabled={index === selectedExercises.length - 1} style={{ border: 'none', background: 'none', color: index === selectedExercises.length - 1 ? '#718096' : 'white', cursor: 'pointer' }}>&#x25BC;</button>
                                        <button type="button" onClick={() => handleRemoveExercise(index)} style={{ border: 'none', background: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>&times;</button>
                                    </div>
                                </div>
                            ))}
                            {selectedExercises.length === 0 && <p style={{ color: '#a0aec0', textAlign: 'center' }}>No exercises added yet.</p>}
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', textAlign: 'right' }}>
                        <button type="submit" disabled={isFormInvalid} style={{ padding: '10px 20px', backgroundColor: isFormInvalid ? '#4a5568' : '#3182ce', color: 'white', borderRadius: '8px', cursor: isFormInvalid ? 'not-allowed' : 'pointer' }}>
                            {isEditMode ? 'Save Changes' : 'Create Routine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoutineModal;