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

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Metadata</h2>
                <button onClick={handleToggleCollapse}>
                    {isCollapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {!isCollapsed && (
                <div style={{ padding: '16px' }}>
                    {/* Categories */}
                    <div style={{ marginBottom: '16px' }}>
                        <label>Session Categories</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {splits.map((split) => (<button key={split} type="button" onClick={() => handleCategoryClick(split)} style={{ padding: '8px', border: '1px solid #4a5568', borderRadius: '8px', backgroundColor: categories.includes(split) ? '#4299e1' : 'transparent', color: 'white' }}>{split}</button>))}
                        </div>
                    </div>

                    {/* Bodyweight */}
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="bodyweight">Bodyweight (lbs)</label>
                        <input id="bodyweight" type="number" value={bodyweight}
                            onChange={(e) => setBodyweight(e.target.value)}
                            onBlur={() => updateSession(sessionId, { bodyweight: Number(bodyweight) || 0 })}
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }}
                        />
                    </div>

                    {/* Session Notes */}
                    <div>
                        <label htmlFor="notes">Session Notes</label>
                        <textarea id="notes" value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={() => updateSession(sessionId, { notes: notes })}
                            rows="4"
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SessionMetadata;