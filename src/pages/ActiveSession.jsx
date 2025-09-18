import { useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading } = useSession(sessionId);

    if (isLoading) {
        return <p>Loading session...</p>;
    }

    if (!session) {
        return <p>Session not found.</p>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Active Workout Session</h1>
            <p>Session ID: <span style={{ fontFamily: 'monospace' }}>{sessionId}</span></p>

            {/* For debugging, we'll display the raw session data for now */}
            <div style={{ background: '#1a202c', padding: '16px', marginTop: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontWeight: 'bold' }}>Session Data:</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default ActiveSession;