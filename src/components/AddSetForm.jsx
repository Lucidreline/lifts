import { useState, useMemo } from 'react';
import { addSetToSession } from '../utils/sessionUtils';
import { updateSession } from '../utils/sessionUtils'
import { checkAndUpdatePr } from '../utils/exerciseUtils';
import { auth } from '../firebase';

function AddSetForm({ session, sessionId, availableExercises, selectedExercise, onExerciseChange }) {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [intensity, setIntensity] = useState('');
    const [notes, setNotes] = useState('');
    const [isComplete, setIsComplete] = useState(true);

    const isCollapsed = session?.uiState?.addSetFormCollapsed ?? false;

    const handleToggleCollapse = () => {
        updateSession(sessionId, { "uiState.addSetFormCollapsed": !isCollapsed });
    };

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
        if (isFormInvalid) return;
        const exerciseObject = availableExercises.find(ex => ex.id === selectedExercise);
        if (!exerciseObject) return;

        const setData = { exercise: selectedExercise, exerciseName: exerciseObject.name, reps, weight, intensity, notes, complete: isComplete };

        // 2. Add the set and get the new set's data back
        const result = await addSetToSession(setData, sessionId, auth.currentUser.uid);

        if (result.success) {
            await checkAndUpdatePr(exerciseObject, result.newSet);
            // Reset form, including the parent's selected exercise state
            onExerciseChange('');
            setReps(''); setWeight(''); setIntensity(''); setNotes('');
            setIsComplete(true);
        } else {
            alert("Failed to add set.");
        }
    };

    const isFormInvalid = !selectedExercise || (isComplete && (!reps || !weight));

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {/* Persistent Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderRadius: isCollapsed ? '8px' : '8px 8px 0 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add a Set</h2>
                <button onClick={handleToggleCollapse}>
                    {isCollapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {/* Conditionally Rendered Form */}
            {!isCollapsed && (
                <div style={{ padding: '16px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label htmlFor="set-exercise" style={{ display: 'block', marginBottom: '4px' }}>Exercise *</label>
                            <select id="set-exercise" value={selectedExercise} onChange={(e) => onExerciseChange(e.target.value)} required style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                                <option value="">Select an exercise...</option>
                                {filteredExercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}                            </select>
                        </div>

                        {isComplete && (
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="set-reps" style={{ display: 'block', marginBottom: '4px' }}>Reps *</label>
                                    <input id="set-reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} required={isComplete} style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="set-weight" style={{ display: 'block', marginBottom: '4px' }}>Weight (lbs) *</label>
                                    <input id="set-weight" type="number" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} required={isComplete} style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="set-intensity" style={{ display: 'block', marginBottom: '4px' }}>Intensity (0-10)</label>
                                    <input id="set-intensity" type="number" step="0.1" min="0" max="10" value={intensity} onChange={(e) => setIntensity(e.target.value)} style={{ flex: 1, width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="set-notes" style={{ display: 'block', marginBottom: '4px' }}>Notes</label>
                            <textarea id="set-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }} />
                            <input
                                type="checkbox"
                                id="is-complete-checkbox"
                                checked={isComplete}
                                onChange={(e) => setIsComplete(e.target.checked)}
                            />
                            <label htmlFor="is-complete-checkbox">Mark as Complete</label>
                        </div>


                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px', alignSelf: 'flex-end' }}>Add Set</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddSetForm;