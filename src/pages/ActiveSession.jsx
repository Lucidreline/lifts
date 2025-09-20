import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useSession } from '../hooks/useSession';
import { useUserExercises } from '../hooks/useUserExercises';
import { useSessionSets } from '../hooks/useSessionSets';
import { useWeeklySets } from '../hooks/useWeeklySets';
import { calculateSessionVolume } from '../utils/graphUtils';
import { updateSession } from '../utils/sessionUtils';
import SessionMetadata from '../components/SessionMetadata';
import GraphFilters from '../components/GraphFilters';
import VolumeGraph from '../components/VolumeGraph';
import AddSetForm from '../components/AddSetForm';
import SessionSetList from '../components/SessionSetList';


function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets: sessionSets, isLoading: areSessionSetsLoading } = useSessionSets(sessionId);

    // Memoize the session start date to prevent re-renders
    const sessionStartDate = useMemo(() => {
        return session?.startDate?.toDate();
    }, [session]); // This will only re-calculate when the session object changes

    const { weeklySets, isLoading: isWeeklyLoading } = useWeeklySets(sessionStartDate);

    const graphFilters = session?.uiState?.graphFilters ?? {
        metric: 'sets',
        muscleGroup: 'simple',
        range: 'session'
    };

    const sessionVolume = useMemo(() => {
        const setsToUse = graphFilters.range === 'week' ? weeklySets : sessionSets;
        if (setsToUse && exercises.length > 0) {
            return calculateSessionVolume(
                setsToUse,
                exercises,
                graphFilters.metric,
                graphFilters.muscleGroup
            );
        }
        return {};
    }, [sessionSets, weeklySets, exercises, graphFilters]);

    const handleFilterChange = (filterName, value) => {
        const updatePath = `uiState.graphFilters.${filterName}`;
        updateSession(sessionId, { [updatePath]: value });
    };

    if (isSessionLoading || areExercisesLoading || areSessionSetsLoading || isWeeklyLoading) {
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

            <GraphFilters filters={graphFilters} onFilterChange={handleFilterChange} />
            <VolumeGraph sessionVolume={sessionVolume} />

            <AddSetForm
                session={session}
                sessionId={sessionId}
                availableExercises={exercises}
            />

            <SessionSetList
                session={session}
                sessionId={sessionId}
                sets={sessionSets} // Use the renamed variable here
            />
        </div>
    );
}

export default ActiveSession;