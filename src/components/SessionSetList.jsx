import { useNavigate } from 'react-router-dom';
import { updateSession } from '../utils/sessionUtils'; // Import the update function

function SessionSetList({ session, sessionId, sets }) {
    const navigate = useNavigate();

    const isCollapsed = session?.uiState?.setListCollapsed ?? false;

    const handleToggleCollapse = () => {
        updateSession(sessionId, { "uiState.setListCollapsed": !isCollapsed });
    };

    const handleView = (sessionId) => {
        navigate(`/session/${sessionId}`);
    };

    // Function to format Firestore Timestamps into HH:MM format for PST
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use false for 24-hour time
            timeZone: 'America/Los_Angeles' // Correctly handles PST/PDT
        });
    };

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {/* Persistent Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderRadius: isCollapsed && sets.length > 0 ? '8px' : '8px 8px 0 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Sets</h2>
                <button onClick={handleToggleCollapse}>
                    {isCollapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {/* Conditionally Rendered List */}
            {!isCollapsed && (
                <>
                    {sets.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#a0aec0' }}>
                            No sets logged for this session yet.
                        </div>
                    ) : (
                        sets.map((set, index) => (
                            <div
                                key={set.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderTop: '1px solid #4a5568'
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{set.exerciseName} {set.isPr && '⭐'}</span>
                                    <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>{formatTime(set.createdAt)}</p>
                                </div>
                                <span style={{ fontFamily: 'monospace' }}>{set.weight}lbs x {set.repCount}</span>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}

export default SessionSetList;