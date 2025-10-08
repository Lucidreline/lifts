// src/components/Navbar.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock Firebase auth as it's not relevant to the UI test
vi.mock('../firebase', () => ({
    auth: {}
}));


describe('Navbar Component', () => {
    const renderNavbar = () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
    };

    it('should toggle the mobile menu on hamburger button click', () => {
        renderNavbar();

        // Find the DIV that contains the navigation links
        // You'll need to add data-testid="nav-links-container" to that div in Navbar.jsx
        const navLinksContainer = screen.getByTestId('nav-links-container');
        expect(navLinksContainer).toHaveClass('hidden');

        // Find the button by its accessible name, which we just added
        const hamburgerButton = screen.getByRole('button', { name: "Open menu" });
        fireEvent.click(hamburgerButton);

        // Now, the container should be visible
        expect(navLinksContainer).not.toHaveClass('hidden');
        expect(navLinksContainer).toHaveClass('flex');

        // The button's label should have changed
        const closeButton = screen.getByRole('button', { name: "Close menu" });
        fireEvent.click(closeButton);

        // Now, the container should be hidden again
        expect(navLinksContainer).toHaveClass('hidden');
    });

});