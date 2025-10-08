// src/components/AddSetForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddSetForm from './AddSetForm';

// Mock utility functions that the component calls
vi.mock('../utils/sessionUtils', () => ({
    addSetToSession: vi.fn(() => Promise.resolve({ success: true, newSet: {} })),
    updateSession: vi.fn(),
}));

vi.mock('../utils/exerciseUtils', () => ({
    checkAndUpdatePr: vi.fn(() => Promise.resolve()),
}));

vi.mock('../firebase', () => ({
    auth: {
        currentUser: {
            uid: 'test-user-123' // Provide a fake user ID
        }
    }
}));

describe('AddSetForm', () => {
    let mockOnExerciseChange;

    beforeEach(() => {
        vi.clearAllMocks();
        mockOnExerciseChange = vi.fn(); // Create a fresh spy function for each test
    });

    const mockProps = {
        session: { uiState: {} },
        sessionId: 's1',
        availableExercises: [{ id: 'ex1', name: 'Bench Press' }],
        selectedExercise: 'ex1',
        onExerciseChange: () => mockOnExerciseChange(), // Pass a wrapper
    };

    it('should NOT reset the exercise when "Remember Exercise" is checked', async () => {
        // Render the component with a modified session state for the checkbox
        const propsWithPreference = {
            ...mockProps,
            session: { uiState: { rememberExercise: true } }
        };
        render(<AddSetForm {...propsWithPreference} />);

        // Fill in required fields
        fireEvent.change(screen.getByLabelText(/Reps/i), { target: { value: '5' } });
        fireEvent.change(screen.getByRole('spinbutton', { name: /Weight/i }), { target: { value: '100' } });
        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: 'Add Set' }));

        // The assertion
        // We need to wait for the async operations to complete
        await vi.waitFor(() => {
            expect(mockOnExerciseChange).not.toHaveBeenCalled();
        });
    });
});