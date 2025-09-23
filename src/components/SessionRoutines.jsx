import { useState, useMemo } from 'react';
import { updateSession, addRoutineToSession } from '../utils/sessionUtils';
import { auth } from '../firebase';

function SessionRoutines({ session, sessionId, allRoutines, availableExercises }) {
    const [selectedRoutineId, setSelectedRoutineId] = useState('');

    const isCollapsed = session?.uiState?.routinesCollapsed ?? true; // Default to collapsed

    const handleToggleCollapse = () => {
        updateSession(sessionId, { "uiState.routinesCollapsed": !isCollapsed });
    };

    // This filters your list of all routines to only show ones relevant to this session
    const filteredRoutines = useMemo(() => {
        const sessionCategories = session?.categories || [];
        if (sessionCategories.length === 0) {
            return allRoutines; // If session has no categories, show all routines
        }
        return allRoutines.filter(routine =>
            // Keep routine if any of its categories exist in the session's categories
            routine.categories.some(cat => sessionCategories.includes(cat))
        );
    }, [session, allRoutines]);

    const handleAddRoutine = async () => {
        if (!selectedRoutineId) return;

        const selectedRoutine = allRoutines.find(r => r.id === selectedRoutineId);
        const userId = auth.currentUser?.uid;

        if (selectedRoutine && userId) {
            await addRoutineToSession(selectedRoutine, sessionId, userId, availableExercises);
            setSelectedRoutineId(''); // Reset dropdown after adding
        }
    };

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderRadius: isCollapsed ? '8px' : '8px 8px 0 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Routines</h2>
                <button onClick={handleToggleCollapse}>{isCollapsed ? 'Show' : 'Hide'}</button>
            </div>

            {!isCollapsed && (
                <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    <select
                        value={selectedRoutineId}
                        onChange={(e) => setSelectedRoutineId(e.target.value)}
                        style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
                    >
                        <option value="">Select a routine...</option>
                        {filteredRoutines.map(routine => <option key={routine.id} value={routine.id}>{routine.name}</option>)}
                    </select>
                    <button onClick={handleAddRoutine} disabled={!selectedRoutineId} style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px', cursor: !selectedRoutineId ? 'not-allowed' : 'pointer' }}>
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

export default SessionRoutines;