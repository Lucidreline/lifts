import { useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useUserExercises } from '../hooks/useUserExercises'; // Import this
import SessionMetadata from '../components/SessionMetadata';
import AddSetForm from '../components/AddSetForm'; // Import this

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises(); // Get exercises

    if (isSessionLoading || areExercisesLoading) {
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

            <AddSetForm
                session={session}
                sessionId={sessionId}
                availableExercises={exercises}
            />
        </div>
    );
}

export default ActiveSession;