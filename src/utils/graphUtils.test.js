import { describe, it, expect } from 'vitest';
import { calculateSessionVolume } from './graphUtils';

// 1. MOCK DATA: We create fake data that mimics our Firestore documents.
const mockExercises = [
    {
        id: 'ex1',
        name: 'Bench Press',
        muscleGroups: {
            primary: { simple: 'Chest', specific: 'Mid Chest' },
            secondary: [
                { simple: 'Shoulders', specific: 'Front Delt' },
                { simple: 'Triceps', specific: 'Tricep Long Head' },
            ],
        },
    },
    {
        id: 'ex2',
        name: 'Shoulder Press',
        muscleGroups: {
            primary: { simple: 'Shoulders', specific: 'Front Delt' },
            secondary: [{ simple: 'Triceps', specific: 'Tricep Lateral Head' }],
        },
    },
];

// 2. TEST SUITE: 'describe' groups all tests for this function together.
describe('calculateSessionVolume', () => {

    // 3. TEST CASE: 'it' describes a single thing we are testing.
    it('should correctly calculate volume by sets', () => {
        const mockSets = [
            { exercise: 'ex1', repCount: 8, complete: true }, // Bench Press
            { exercise: 'ex1', repCount: 8, complete: true }, // Bench Press
            { exercise: 'ex2', repCount: 10, complete: true }, // Shoulder Press
        ];

        const result = calculateSessionVolume(mockSets, mockExercises, 'sets', 'simple');

        // 4. ASSERTION: 'expect' checks if the result is what we want.
        expect(result).toEqual({
            Chest: { primary: 2, secondary: 0, goal: 0 },
            Shoulders: { primary: 1, secondary: 1, goal: 0 }, // 1 primary + (2 * 0.5) secondary
            Triceps: { primary: 0, secondary: 1.5, goal: 0 }, // (2 * 0.5) + (1 * 0.5) secondary
        });
    });

    it('should correctly calculate volume by reps', () => {
        const mockSets = [
            { exercise: 'ex1', repCount: 8, complete: true }, // Bench Press (8 reps)
            { exercise: 'ex2', repCount: 10, complete: true }, // Shoulder Press (10 reps)
        ];

        const result = calculateSessionVolume(mockSets, mockExercises, 'reps', 'simple');

        expect(result).toEqual({
            Chest: { primary: 8, secondary: 0, goal: 0 },
            Shoulders: { primary: 10, secondary: 4, goal: 0 }, // 10 primary + (8 * 0.5) secondary
            Triceps: { primary: 0, secondary: 9, goal: 0 }, // (8 * 0.5) + (10 * 0.5) secondary
        });
    });

    it('should correctly calculate goal volume for incomplete sets', () => {
        const mockSets = [
            { exercise: 'ex1', repCount: 8, complete: true }, // Completed Bench Press
            { exercise: 'ex1', repCount: 10, complete: false }, // Planned Bench Press
        ];

        const result = calculateSessionVolume(mockSets, mockExercises, 'sets', 'simple');

        expect(result).toEqual({
            Chest: { primary: 1, secondary: 0, goal: 1 },
            Shoulders: { primary: 0, secondary: 0.5, goal: 0.5 },
            Triceps: { primary: 0, secondary: 0.5, goal: 0.5 },
        });
    });

    it('should return an empty object if there are no sets', () => {
        const result = calculateSessionVolume([], mockExercises, 'sets', 'simple');
        expect(result).toEqual({});
    });
});