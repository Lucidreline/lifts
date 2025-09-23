import { updateSession, deleteSet } from '../utils/sessionUtils';
import { useUserExercises } from '../hooks/useUserExercises';
import { calculateSessionVolume } from '../utils/graphUtils';
import SessionMetadata from '../components/SessionMetadata';
import SessionSetList from '../components/SessionSetList';
import { useSessionSets } from '../hooks/useSessionSets';
import { useWeeklySets } from '../hooks/useWeeklySets';
import EditSetModal from '../components/EditSetModal';
import GraphFilters from '../components/GraphFilters';
import { rollbackPr } from '../utils/exerciseUtils';
import VolumeGraph from '../components/VolumeGraph';
import AddSetForm from '../components/AddSetForm';
import { useSession } from '../hooks/useSession';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';



function ActiveSession() {
    const { sessionId } = useParams();
    const { session, isLoading: isSessionLoading } = useSession(sessionId);
    const { exercises, isLoading: areExercisesLoading } = useUserExercises();
    const { sets: sessionSets, isLoading: areSessionSetsLoading } = useSessionSets(sessionId);
    const [isEditSetModalOpen, setIsEditSetModalOpen] = useState(false);
    const [setToEdit, setSetToEdit] = useState(null);

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

    const handleDeleteSet = async (set) => { // Now accepts the full 'set' object
        if (window.confirm("Are you sure you want to delete this set?")) {
            // First, delete the set
            const result = await deleteSet(sessionId, set.id);

            // If deletion was successful AND the set was a PR, trigger the rollback
            if (result.success && set.isPr) {
                await rollbackPr(set.exercise); // set.exercise holds the exercise ID
            }
        }
    };

    const handleOpenEditSetModal = (set) => {
        setSetToEdit(set);
        setIsEditSetModalOpen(true);
    };

    const handleCloseEditSetModal = () => {
        setIsEditSetModalOpen(false);
        setSetToEdit(null);
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
                sets={sessionSets}
                onDelete={handleDeleteSet}
                onEdit={handleOpenEditSetModal}
            />

            <EditSetModal
                isOpen={isEditSetModalOpen}
                onClose={handleCloseEditSetModal}
                setToEdit={setToEdit}
                availableExercises={exercises}
                session={session}
            />
        </div>
    );
}

export default ActiveSession;