import { useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import SessionMetadata from '../components/SessionMetadata';

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
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '24px' }}>
                Active Workout Session
            </h1>

            <SessionMetadata session={session} sessionId={sessionId} />

            {/* Other sections like the graph and set entry form will go here later */}
        </div>
    );
}

export default ActiveSession;