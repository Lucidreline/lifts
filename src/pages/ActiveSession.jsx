import { useParams } from 'react-router-dom';
import { useMemo } from 'react'; // Import useMemo
import { useSession } from '../hooks/useSession';
import { useUserExercises } from '../hooks/useUserExercises';
import { useSessionSets } from '../hooks/useSessionSets';
import { calculateSessionVolume } from '../utils/graphUtils'; // Import our new function
import SessionMetadata from '../components/SessionMetadata';
import AddSetForm from '../components/AddSetForm';
import SessionSetList from '../components/SessionSetList';
import VolumeGraph from '../components/VolumeGraph'

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets, isLoading: areSetsLoading } = useSessionSets(sessionId);

    // Use useMemo to calculate the volume only when sets or exercises change
    const sessionVolume = useMemo(() => {
        if (sets.length > 0 && exercises.length > 0) {
            return calculateSessionVolume(sets, exercises);
        }
        return {}; // Return empty object if data is not ready
    }, [sets, exercises]);


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

            <VolumeGraph sessionVolume={sessionVolume} />

            <AddSetForm
                session={session}
                sessionId={sessionId}
                availableExercises={exercises}
            />

            <SessionSetList
                session={session}
                sessionId={sessionId}
                sets={sets}
            />
        </div>
    );
}

export default ActiveSession;