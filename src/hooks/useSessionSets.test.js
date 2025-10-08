// src/hooks/useSessionSets.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionSets } from './useSessionSets';
import * as sessionUtils from '../utils/sessionUtils';

// Mock the sessionUtils module to control the data our hook receives
vi.mock('../utils/sessionUtils', () => ({
    getSessionSets: vi.fn(),
}));

// Mock a Timestamp object for our test data
const mockTimestamp = (seconds) => ({
    toMillis: () => seconds * 1000,
});

describe('useSessionSets hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should sort sets correctly, with routine sets ordered internally', () => {
        const mockUnsortedSets = [
            { id: 'set4', exerciseName: 'Manual Set 3', createdAt: mockTimestamp(104) },
            { id: 'routine-c', exerciseName: 'Row', order: 2, createdAt: mockTimestamp(100) },
            { id: 'routine-a', exerciseName: 'Incline Press', order: 0, createdAt: mockTimestamp(101) },
            { id: 'routine-b', exerciseName: 'Incline Press', order: 1, createdAt: mockTimestamp(100.5) },
            { id: 'set1', exerciseName: 'Manual Set 1', createdAt: mockTimestamp(90) },
        ];

        let callback;
        sessionUtils.getSessionSets.mockImplementation((sessionId, cb) => {
            callback = cb;
            callback(mockUnsortedSets);
            return () => { };
        });

        const { result } = renderHook(() => useSessionSets('session123'));

        // --- THIS IS THE UPDATED PART ---
        // Extract just the IDs from the sorted sets
        const sortedIds = result.current.sets.map(set => set.id);

        // Assert that the IDs are in the correct sequence
        expect(sortedIds).toEqual([
            'set4',
            'routine-a',
            'routine-b',
            'routine-c',
            'set1',
        ]);
    });
});