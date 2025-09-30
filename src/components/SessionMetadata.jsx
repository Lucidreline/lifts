import { useState, useEffect } from 'react';
import { updateSession } from '../utils/sessionUtils';
import splits from '../data/splits.js';

function SessionMetadata({ session, sessionId }) {
    // Local state for the form inputs for a responsive UI
    const [categories, setCategories] = useState([]);
    const [bodyweight, setBodyweight] = useState('');
    const [notes, setNotes] = useState('');

    // This effect syncs the local state with the data from Firestore
    useEffect(() => {
        if (session) {
            setCategories(session.categories || []);
            setBodyweight(session.bodyweight || '');
            setNotes(session.notes || '');
        }
    }, [session]);

    // Read the collapsed state from the session data, defaulting to 'false' (expanded)
    const isCollapsed = session?.uiState?.metadataCollapsed ?? false;

    const handleToggleCollapse = () => {
        // Update the nested field in Firestore using dot notation
        updateSession(sessionId, { "uiState.metadataCollapsed": !isCollapsed });
    };

    const handleCategoryClick = (category) => {
        const newCategories = categories.includes(category)
            ? categories.filter(c => c !== category)
            : [...categories, category];
        setCategories(newCategories);
        updateSession(sessionId, { categories: newCategories });
    };

    // ✨ Refactored the entire JSX block to use Tailwind CSS instead of inline styles 💅
    return (
        <div className="border border-slate-700 rounded-lg mb-6 bg-slate-800/50 text-slate-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-slate-800 rounded-t-lg">
                <h2 className="text-xl font-bold text-white">Metadata</h2>
                <button
                    onClick={handleToggleCollapse}
                    className="px-3 py-1 text-sm font-semibold bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                >
                    {isCollapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {/* Collapsible Content */}
            {!isCollapsed && (
                <div className="p-4">
                    {/* Categories */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Session Categories</label>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {splits.map((split) => (
                                <button
                                    key={split}
                                    type="button"
                                    onClick={() => handleCategoryClick(split)}
                                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${categories.includes(split)
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {split}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bodyweight */}
                    <div className="mb-4">
                        <label htmlFor="bodyweight" className="block text-sm font-medium mb-1">Bodyweight (lbs)</label>
                        <input
                            id="bodyweight"
                            type="number"
                            value={bodyweight}
                            onChange={(e) => setBodyweight(e.target.value)}
                            onBlur={() => updateSession(sessionId, { bodyweight: Number(bodyweight) || 0 })}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded mt-1 text-white placeholder-slate-400"
                            placeholder="Enter bodyweight..."
                        />
                    </div>

                    {/* Session Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-1">Session Notes</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={() => updateSession(sessionId, { notes: notes })}
                            rows="4"
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded mt-1 text-white placeholder-slate-400"
                            placeholder="Add any notes for this session..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SessionMetadata;