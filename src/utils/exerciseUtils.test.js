import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkAndUpdatePr, rollbackPr } from './exerciseUtils';
import { doc, updateDoc, getDoc, Timestamp, arrayUnion } from 'firebase/firestore';

// ✨ 2. Update the mock to include 'arrayUnion'
vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        doc: vi.fn(),
        updateDoc: vi.fn(),
        getDoc: vi.fn(),
        arrayUnion: vi.fn(), // We just need to mock that it's a function
        Timestamp: { now: vi.fn(() => ({ seconds: 12345, nanoseconds: 67890 })) },
    };
});

describe('checkAndUpdatePr', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should set a new PR if currentPr is null', async () => {
        const mockExercise = {
            id: 'ex1',
            name: 'Bench Press',
            pr: { currentPr: null, pastPrs: [] }
        };
        const mockNewSet = { id: 'set1', score: 100, repCount: 5, weight: 20, session: 'session1' };

        await checkAndUpdatePr(mockExercise, mockNewSet);

        // ✨ 3. Check that updateDoc was called twice (once for exercise, once for set)
        expect(updateDoc).toHaveBeenCalledTimes(2);

        // Check that the exercise was updated with the new PR data
        expect(updateDoc).toHaveBeenCalledWith(undefined, {
            "pr.currentPr": expect.objectContaining({ score: 100, setId: 'set1' })
        });

        // Check that the set was updated to be marked as a PR
        expect(updateDoc).toHaveBeenCalledWith(undefined, { isPr: true });
    });

    it('should set a new PR if new score is higher and move old PR to pastPrs', async () => {
        const oldPr = { setId: 'oldSet', score: 90, reps: 4 };
        const mockExercise = {
            id: 'ex1',
            name: 'Bench Press',
            pr: { currentPr: oldPr, pastPrs: [] }
        };
        const mockNewSet = { id: 'set1', score: 100, repCount: 5, weight: 20, session: 'session1' };

        await checkAndUpdatePr(mockExercise, mockNewSet);

        // The first call to updateDoc should be for the exercise
        const firstUpdateCallArgs = updateDoc.mock.calls[0];

        // ✨ 3. Update the assertion to check for arrayUnion
        expect(firstUpdateCallArgs[1]).toEqual({
            "pr.currentPr": expect.objectContaining({ score: 100 }),
            "pr.pastPrs": arrayUnion(oldPr) // Check that it was called with the arrayUnion function
        });

        // Check that the set was also updated
        expect(updateDoc).toHaveBeenCalledWith(undefined, { isPr: true });
    });

    it('should NOT update if the new score is lower than the current PR', async () => {
        const oldPr = { setId: 'oldSet', score: 110, reps: 6 };
        const mockExercise = {
            id: 'ex1',
            name: 'Bench Press',
            pr: { currentPr: oldPr, pastPrs: [] }
        };
        const mockNewSet = { id: 'set1', score: 100, repCount: 5, weight: 20, session: 'session1' };

        await checkAndUpdatePr(mockExercise, mockNewSet);

        // ✨ 4. Check that updateDoc was never called because it wasn't a new PR
        expect(updateDoc).not.toHaveBeenCalled();
    });
});

describe('rollbackPr', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should promote the most recent past PR to currentPr', async () => {
        // Define the PRs in stable variables
        const olderPr = { setId: 'setA', score: 90, timestamp: { seconds: 1000 } };
        const recentPr = { setId: 'setB', score: 100, timestamp: { seconds: 2000 } };
        const mockPastPrs = [olderPr, recentPr];

        const mockExerciseData = { pr: { pastPrs: mockPastPrs } };

        getDoc.mockResolvedValue({ exists: () => true, data: () => mockExerciseData });

        await rollbackPr('ex1');

        // Assert using the stable variables, not the potentially mutated array indices
        expect(updateDoc).toHaveBeenCalledWith(undefined, {
            "pr.currentPr": recentPr,  // Expect the most recent PR object
            "pr.pastPrs": [olderPr],   // Expect the older PR object to be what's left
        });
    });

    it('should set currentPr to null if there are no past PRs', async () => {
        // Setup: An exercise with an empty pastPrs array
        const mockExerciseData = { pr: { pastPrs: [] } };
        getDoc.mockResolvedValue({ exists: () => true, data: () => mockExerciseData });

        await rollbackPr('ex1');

        expect(updateDoc).toHaveBeenCalledWith(undefined, {
            "pr.currentPr": null, // currentPr should be cleared
            "pr.pastPrs": [],   // pastPrs should remain empty
        });
    });
});