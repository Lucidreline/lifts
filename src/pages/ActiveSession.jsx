import { useParams } from 'react-router-dom';
import { useMemo, useState, useCallback, useEffect } from 'react';
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
import { rollbackPr } from '../utils/exerciseUtils';

function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets, isLoading: areSetsLoading } = useSessionSets(sessionId);
    const { routines, isLoading: areRoutinesLoading } = useUserRoutines();
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const sessionStartDate = useMemo(() => {
        return session?.startDate?.toDate();
    }, [session]);

    const { weeklySets, isLoading: isWeeklyLoading } = useWeeklySets(sessionStartDate);

    const [isEditSetModalOpen, setIsEditSetModalOpen] = useState(false);
    const [setToEdit, setSetToEdit] = useState(null);

    useEffect(() => {
        const allDataLoaded = !isSessionLoading && !areExercisesLoading && !areSetsLoading && !isWeeklyLoading && !areRoutinesLoading;
        if (allDataLoaded) {
            setIsInitialLoad(false);
        }
    }, [isSessionLoading, areExercisesLoading, areSetsLoading, isWeeklyLoading, areRoutinesLoading]);

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

    const handleFilterChange = useCallback((filterName, value) => {
        const updatePath = `uiState.graphFilters.${filterName}`;
        updateSession(sessionId, { [updatePath]: value });
    }, [sessionId]);

    const handleDeleteSet = useCallback(async (set) => {
        if (window.confirm("Are you sure you want to delete this set?")) {
            const result = await deleteSet(sessionId, set.id);
            if (result.success && set.isPr) {
                await rollbackPr(set.exercise);
            }
        }
    }, [sessionId]);

    const handleOpenEditSetModal = useCallback((set) => {
        setSetToEdit(set);
        setIsEditSetModalOpen(true);
    }, []);

    const handleCloseEditSetModal = useCallback(() => {
        setIsEditSetModalOpen(false);
        setSetToEdit(null);
    }, []);

    if (isInitialLoad) {
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
            <VolumeGraph sessionVolume={sessionVolume} session={session} sessionId={sessionId} />            <AddSetForm onExerciseChange={setSelectedExerciseId} selectedExercise={selectedExerciseId} session={session} sessionId={sessionId} availableExercises={exercises} />
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