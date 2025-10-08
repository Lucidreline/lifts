import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addRoutineToSession, deleteSet, deleteSession } from './sessionUtils';
import * as exerciseUtils from './exerciseUtils';
// 1. Import ALL the functions we need to access in our tests
import { getDocs, writeBatch, doc, query, where, collection, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';

// 2. Update the mock to include ALL functions we want to control
vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getDocs: vi.fn(),
        writeBatch: vi.fn(() => ({
            delete: vi.fn(),
            commit: vi.fn(),
            set: vi.fn(),    // Add set
            update: vi.fn(), // Add update
        })),
        doc: vi.fn(() => ({ ref: 'mock-doc-ref' })), // Simplified mock
        query: vi.fn(),
        where: vi.fn(),
        collection: vi.fn(),
        deleteDoc: vi.fn(), // Add deleteDoc
        updateDoc: vi.fn(), // Add updateDoc
        arrayRemove: vi.fn(),// Add arrayRemove
    };
});

// Mock our own exerciseUtils module to spy on rollbackPr
vi.mock('./exerciseUtils', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        rollbackPr: vi.fn(),
    };
});

// --- TESTS ---

describe('addRoutineToSession', () => {
    beforeEach(() => vi.clearAllMocks());

    it('should create a set for each exercise and update the session', async () => {
        const mockBatch = { set: vi.fn(), update: vi.fn(), commit: vi.fn() };
        writeBatch.mockReturnValue(mockBatch);

        const mockRoutine = {
            exercises: [
                { exerciseId: 'ex1', order: 0 },
                { exerciseId: 'ex2', order: 1 },
            ]
        };
        const mockAllExercises = [
            { id: 'ex1', name: 'Push Up' },
            { id: 'ex2', name: 'Dips' },
        ];

        await addRoutineToSession(mockRoutine, 'session123', 'user123', mockAllExercises);

        expect(writeBatch).toHaveBeenCalledTimes(1);
        expect(mockBatch.set).toHaveBeenCalledTimes(2); // Called for each exercise
        expect(mockBatch.update).toHaveBeenCalledTimes(1); // Called once for the session
        expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    });
});


describe('deleteSet', () => {
    beforeEach(() => vi.clearAllMocks());

    it('should delete the set and remove its ID from the session', async () => {
        await deleteSet('session123', 'set123');

        // Assert that the set document was deleted
        expect(deleteDoc).toHaveBeenCalledTimes(1);

        // Assert that the session document was updated
        expect(updateDoc).toHaveBeenCalledTimes(1);
        expect(arrayRemove).toHaveBeenCalledWith('set123');
    });
});


describe('deleteSession', () => {
    beforeEach(() => vi.clearAllMocks());

    it('should delete a session and its sets, and roll back a PR', async () => {
        const docs = [
            { data: () => ({ isPr: true, exercise: 'exercise123' }), ref: 'setRef1' },
            { data: () => ({ isPr: false }), ref: 'setRef2' },
        ];
        const mockSetsSnapshot = {
            docs: docs,
            forEach: (callback) => docs.forEach(callback), // Add the forEach method
        };
        // 3. Use the imported getDocs
        getDocs.mockResolvedValue(mockSetsSnapshot);

        const mockBatch = { delete: vi.fn(), commit: vi.fn() };
        writeBatch.mockReturnValue(mockBatch);

        await deleteSession('sessionABC');

        expect(exerciseUtils.rollbackPr).toHaveBeenCalledWith('exercise123');
        expect(mockBatch.delete).toHaveBeenCalledWith('setRef1');
        expect(mockBatch.delete).toHaveBeenCalledWith('setRef2');
        expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    });
});