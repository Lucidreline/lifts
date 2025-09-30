import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserDocument } from './userUtils';
import { getDoc, setDoc } from 'firebase/firestore';

// ✨ This mock now uses 'importOriginal' to keep the real functions we don't want to fake
vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal(); // Get the original library
    return {
        ...actual, // Return all the original functions (like getFirestore)
        // And overwrite just the ones we want to control
        doc: vi.fn(),
        getDoc: vi.fn(),
        setDoc: vi.fn(),
    };
});

describe('createUserDocument', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a new user document if one does not exist', async () => {
        const mockUser = { uid: '123' };
        getDoc.mockResolvedValue({ exists: () => false });

        await createUserDocument(mockUser);

        expect(setDoc).toHaveBeenCalledTimes(1);
        expect(setDoc).toHaveBeenCalledWith(undefined, {
            id: '123',
            exercises: [],
            sessions: [],
        });
    });

    it('should NOT create a document if one already exists', async () => {
        const mockUser = { uid: '123' };
        getDoc.mockResolvedValue({ exists: () => true });

        await createUserDocument(mockUser);

        expect(setDoc).not.toHaveBeenCalled();
    });
});