import { useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useUserExercises } from '../hooks/useUserExercises';
import { useSessionSets } from '../hooks/useSessionSets'; // Import new hook
import SessionMetadata from '../components/SessionMetadata';
import AddSetForm from '../components/AddSetForm';
import SessionSetList from '../components/SessionSetList'; // Import new list

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets, isLoading: areSetsLoading } = useSessionSets(sessionId); // Use new hook

    if (isSessionLoading || areExercisesLoading || areSetsLoading) {
        return <p>Loading session...</p>;
    }

    if (!session) {
        return <p>Session not found.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
                Active Workout Session
            </h1>

            <SessionMetadata session={session} sessionId={sessionId} />

            <AddSetForm
                session={session}
                sessionId={sessionId}
                availableExercises={exercises}
            />

            <SessionSetList sets={sets} />
        </div>
    );
}

export default ActiveSession;