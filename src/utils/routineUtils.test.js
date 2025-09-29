import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addRoutineToFirestore } from './routineUtils';
// ✨ 1. Import the functions we need to mock
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ✨ 2. Set up the mock for Firestore
vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        collection: vi.fn(),
        addDoc: vi.fn(),
        serverTimestamp: vi.fn(),
    };
});

describe('addRoutineToFirestore', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a routine with a transformed array of exercise IDs', async () => {
        // ✨ 3. Set up mock data, including full exercise objects
        const mockRoutineData = {
            routineName: 'My Push Day',
            routineCategories: ['Push'],
            selectedExercises: [
                { id: 'ex1', name: 'Push Up' },
                { id: 'ex2', name: 'Dips' },
            ],
        };
        const mockUserId = 'user123';

        await addRoutineToFirestore(mockRoutineData, mockUserId);

        // ✨ 4. Assert that addDoc was called with the correct, transformed data
        expect(addDoc).toHaveBeenCalledTimes(1);
        expect(addDoc).toHaveBeenCalledWith(
            undefined, // The collection reference
            expect.objectContaining({
                name: 'My Push Day',
                categories: ['Push'],
                user: mockUserId,
                exercises: ['ex1', 'ex2'], // Check that it's an array of IDs, not objects
            })
        );
    });
});