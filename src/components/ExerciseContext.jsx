import { useState, useEffect } from 'react';
import { updateSession } from '../utils/sessionUtils';
import { getLastSetsForExercise } from '../utils/exerciseUtils';

function ExerciseContext({ session, sessionId, selectedExerciseId, allExercises }) {
    const [lastSets, setLastSets] = useState([]);

    // Find the full exercise object based on the selected ID
    const selectedExercise = allExercises.find(ex => ex.id === selectedExerciseId);

    // This effect re-fetches the last sets whenever the selected exercise changes
    useEffect(() => {
        if (selectedExerciseId) {
            getLastSetsForExercise(selectedExerciseId).then(fetchedSets => {
                setLastSets(fetchedSets);
            });
        } else {
            setLastSets([]); // Clear the list if no exercise is selected
        }
    }, [selectedExerciseId]);

    const isCollapsed = session?.uiState?.exerciseContextCollapsed ?? true; // Default to collapsed

    const handleToggleCollapse = () => {
        updateSession(sessionId, { "uiState.exerciseContextCollapsed": !isCollapsed });
    };

    const formatSimpleDate = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderRadius: isCollapsed ? '8px' : '8px 8px 0 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Exercise Context</h2>
                <button onClick={handleToggleCollapse}>{isCollapsed ? 'Show' : 'Hide'}</button>
            </div>

            {!isCollapsed && (
                <div style={{ padding: '16px' }}>
                    {!selectedExercise ? (
                        <p style={{ color: '#a0aec0', textAlign: 'center' }}>Select an exercise from the form above to see its details.</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {/* Left Column: PR */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 'bold' }}>Current PR</h3>
                                {selectedExercise.pr?.currentPr ? (
                                    <p style={{ fontFamily: 'monospace' }}>
                                        {selectedExercise.pr.currentPr.weight}lbs x {selectedExercise.pr.currentPr.reps}
                                    </p>
                                ) : <p>No PR set yet.</p>}
                                {selectedExercise.repRange && (
                                    <p style={{ marginTop: '8px' }}>
                                        <b>Rep Range:</b> {selectedExercise.repRange}
                                    </p>
                                )}
                            </div>

                            {/* Middle Column: Muscle Groups */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 'bold' }}>Muscle Groups</h3>
                                <p><b>Primary:</b> {selectedExercise.muscleGroups.primary.simple}
                                    {selectedExercise.muscleGroups.primary.specific && ` (${selectedExercise.muscleGroups.primary.specific})`}
                                </p>


                                <p><b>Secondary:</b> {selectedExercise.muscleGroups.secondary.map(s =>
                                    `${s.simple}${s.specific ? ` (${s.specific})` : ''}`
                                ).join(', ')}
                                </p>
                            </div>

                            {/* Right Column: Last Sets */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 'bold' }}>Recent History</h3>
                                {lastSets.length > 0 ? (
                                    lastSets.map(set => (
                                        <p key={set.id} style={{ fontFamily: 'monospace' }}>
                                            {set.weight}lbs x {set.repCount} ({formatSimpleDate(set.createdAt)})
                                        </p>
                                    ))
                                ) : <p>No recent history.</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExerciseContext;