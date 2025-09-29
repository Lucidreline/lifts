import { vi } from 'vitest';

// Mock the 'import.meta.env' object for Vitest
vi.mock('vite', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        loadEnv: () => ({ ...process.env }),
    };
});