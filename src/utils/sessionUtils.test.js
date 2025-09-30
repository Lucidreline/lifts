import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addRoutineToSession, deleteSet } from './sessionUtils';
// ✨ 1. Import all the functions we need to mock
import { collection, doc, writeBatch, arrayUnion, serverTimestamp, arrayRemove, deleteDoc, updateDoc } from 'firebase/firestore';

// ✨ 2. The mock setup, including a mock for writeBatch
const mockBatch = {
    set: vi.fn(),
    update: vi.fn(),
    commit: vi.fn(),
};

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        collection: vi.fn(),
        doc: vi.fn(() => ({ id: 'mock-doc-id' })),
        arrayRemove: vi.fn((...args) => `arrayRemove(${args.join(', ')})`),
        writeBatch: vi.fn(() => mockBatch), // When writeBatch is called, return our mock batch object
        arrayUnion: vi.fn((...args) => `arrayUnion(${args.join(', ')})`), // Simple mock for arrayUnion
        serverTimestamp: vi.fn(),
        deleteDoc: vi.fn(),
        updateDoc: vi.fn(),
    };
});


describe('addRoutineToSession', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a set for each exercise in the routine and update the session in a batch', async () => {
        // ✨ 3. Set up our mock data
        const mockRoutine = {
            exercises: ['ex1', 'ex2'], // A routine with two exercise IDs
        };
        const mockAllExercises = [
            { id: 'ex1', name: 'Push Up' },
            { id: 'ex2', name: 'Pull Up' },
        ];
        const sessionId = 'session123';
        const userId = 'user123';

        await addRoutineToSession(mockRoutine, sessionId, userId, mockAllExercises);

        // ✨ 4. Assert that our batch functions were used correctly
        expect(writeBatch).toHaveBeenCalledTimes(1);
        expect(mockBatch.set).toHaveBeenCalledTimes(2); // Called once for each exercise
        expect(mockBatch.update).toHaveBeenCalledTimes(1); // Called once for the session
        expect(mockBatch.commit).toHaveBeenCalledTimes(1); // The batch was executed

        // Optional: A more detailed check on the first set created
        const firstSetCallArgs = mockBatch.set.mock.calls[0][1];
        expect(firstSetCallArgs).toEqual(expect.objectContaining({
            complete: false,
            exercise: 'ex1',
            exerciseName: 'Push Up',
        }));
    });
});

describe('deleteSet', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delete the set document and remove its ID from the session', async () => {
        const sessionId = 'session123';
        const setId = 'setABC';

        await deleteSet(sessionId, setId);

        // 1. Assert that the set document was deleted
        expect(deleteDoc).toHaveBeenCalledTimes(1);

        // 2. Assert that the session document was updated to remove the set ID
        expect(updateDoc).toHaveBeenCalledTimes(1);
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(), // We don't need to check the doc ref here
            { sets: arrayRemove(setId) } // Check that it tried to remove the correct ID
        );
    });
});