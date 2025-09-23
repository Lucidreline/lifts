import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { useUserExercises } from '../hooks/useUserExercises';
import { useSessionSets } from '../hooks/useSessionSets';
import { useWeeklySets } from '../hooks/useWeeklySets';
import { useUserRoutines } from '../hooks/useUserRoutines';
import { calculateSessionVolume } from '../utils/graphUtils';
import { updateSession, deleteSet } from '../utils/sessionUtils';
import SessionMetadata from '../components/SessionMetadata';
import SessionRoutines from '../components/SessionRoutines';
import GraphFilters from '../components/GraphFilters';
import VolumeGraph from '../components/VolumeGraph';
import AddSetForm from '../components/AddSetForm';
import SessionSetList from '../components/SessionSetList';
import EditSetModal from '../components/EditSetModal';
import ExerciseContext from '../components/ExerciseContext';

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets, isLoading: areSetsLoading } = useSessionSets(sessionId);
    const { routines, isLoading: areRoutinesLoading } = useUserRoutines();
    const [selectedExerciseId, setSelectedExerciseId] = useState('');

    // THIS IS THE FIX: Memoize the session start date to prevent re-renders
    const sessionStartDate = useMemo(() => {
        return session?.startDate?.toDate();
    }, [session]);

    const { weeklySets, isLoading: isWeeklyLoading } = useWeeklySets(sessionStartDate);

    const [isEditSetModalOpen, setIsEditSetModalOpen] = useState(false);
    const [setToEdit, setSetToEdit] = useState(null);

    const graphFilters = session?.uiState?.graphFilters ?? {
        metric: 'sets', muscleGroup: 'simple', range: 'session'
    };

    const sessionVolume = useMemo(() => {
        const setsToUse = graphFilters.range === 'week' ? weeklySets : sets;
        if (setsToUse && exercises.length > 0) {
            return calculateSessionVolume(setsToUse, exercises, graphFilters.metric, graphFilters.muscleGroup);
        }
        return {};
    }, [sets, weeklySets, exercises, graphFilters]);

    const handleFilterChange = (filterName, value) => {
        const updatePath = `uiState.graphFilters.${filterName}`;
        updateSession(sessionId, { [updatePath]: value });
    };

    const handleDeleteSet = async (set) => { /* ... */ };
    const handleOpenEditSetModal = (set) => { /* ... */ };
    const handleCloseEditSetModal = () => { /* ... */ };

    if (isSessionLoading || areExercisesLoading || areSetsLoading || isWeeklyLoading || areRoutinesLoading) {
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
            <SessionRoutines session={session} sessionId={sessionId} allRoutines={routines} availableExercises={exercises} />
            <GraphFilters filters={graphFilters} onFilterChange={handleFilterChange} />
            <VolumeGraph sessionVolume={sessionVolume} />
            <AddSetForm onExerciseChange={setSelectedExerciseId} selectedExercise={selectedExerciseId} session={session} sessionId={sessionId} availableExercises={exercises} />
            <ExerciseContext
                session={session}
                sessionId={sessionId}
                selectedExerciseId={selectedExerciseId}
                allExercises={exercises}
            />
            <SessionSetList session={session} sessionId={sessionId} sets={sets} onDelete={handleDeleteSet} onEdit={handleOpenEditSetModal} />
            <EditSetModal isOpen={isEditSetModalOpen} onClose={handleCloseEditSetModal} setToEdit={setToEdit} availableExercises={exercises} session={session} />
        </div>
    );
}

export default ActiveSession;