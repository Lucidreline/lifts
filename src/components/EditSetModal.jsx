import { useState, useEffect, useMemo } from 'react';
import { updateSet } from '../utils/sessionUtils';
import { rollbackPr, checkAndUpdatePr } from '../utils/exerciseUtils';

function EditSetModal({ isOpen, onClose, setToEdit, availableExercises, session }) {
    // Local state for the form inputs
    const [exercise, setExercise] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [intensity, setIntensity] = useState('');
    const [notes, setNotes] = useState('');
    const [isComplete, setIsComplete] = useState(true);

    // This effect pre-fills the form whenever the set to edit changes
    useEffect(() => {
        if (setToEdit) {
            setExercise(setToEdit.exercise || '');
            setReps(setToEdit.repCount || '');
            setWeight(setToEdit.weight || '');
            setIntensity(setToEdit.intensity || '');
            setNotes(setToEdit.notes || '');
            setIsComplete(true);
        }
    }, [setToEdit]);

    // Filter exercises for the dropdown based on session categories
    const filteredExercises = useMemo(() => {
        if (!session?.categories || session.categories.length === 0) {
            return availableExercises;
        }
        return availableExercises.filter(ex =>
            ex.categories.some(cat => session.categories.includes(cat))
        );
    }, [session, availableExercises]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- PR LOGIC ---
        // 1. If the original set was a PR, we need to roll back the PR on its original exercise.
        if (setToEdit.isPr) {
            console.log(`Rolling back PR for original exercise: ${setToEdit.exerciseName}`);
            await rollbackPr(setToEdit.exercise);
        }

        // 2. Prepare the updated set data
        const newScore = (Number(reps) || 0) * (Number(weight) || 0);
        const updatedData = {
            exercise,
            exerciseName: availableExercises.find(ex => ex.id === exercise)?.name || '',
            repCount: Number(reps) || 0,
            weight: Number(weight) || 0,
            intensity: Number(intensity) || 0,
            notes,
            score: newScore,
            complete: isComplete,
            isPr: false,
            updatedAt: new Date(),
        };

        // 3. Update the set document in Firestore
        await updateSet(setToEdit.id, updatedData);

        // 4. Now, check if this UPDATED set is a new PR for its exercise
        const fullExerciseObject = availableExercises.find(ex => ex.id === exercise);
        if (fullExerciseObject) {
            // Construct a temporary 'set' object that matches the structure our PR checker expects
            const updatedSetForPrCheck = { ...setToEdit, ...updatedData };
            await checkAndUpdatePr(fullExerciseObject, updatedSetForPrCheck);
        }

        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#2d3748', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Set</h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem' }}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div>
                        <label htmlFor="edit-set-exercise" style={{ display: 'block', marginBottom: '4px' }}>Exercise *</label>
                        <select id="edit-set-exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} required style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                            <option value="">Select an exercise...</option>
                            {filteredExercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="edit-set-reps" style={{ display: 'block', marginBottom: '4px' }}>Reps *</label>
                            <input id="edit-set-reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} required style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="edit-set-weight" style={{ display: 'block', marginBottom: '4px' }}>Weight (lbs) *</label>
                            <input id="edit-set-weight" type="number" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} required style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="edit-set-intensity" style={{ display: 'block', marginBottom: '4px' }}>Intensity (0-10)</label>
                            <input id="edit-set-intensity" type="number" step="0.1" min="0" max="10" value={intensity} onChange={(e) => setIntensity(e.target.value)} style={{ flex: 1, width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-set-notes" style={{ display: 'block', marginBottom: '4px' }}>Notes</label>
                        <textarea id="edit-set-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px', alignSelf: 'flex-end' }}>Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditSetModal;