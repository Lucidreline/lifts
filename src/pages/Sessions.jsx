import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createNewSession } from '../utils/sessionUtils';

function Sessions() {
    const navigate = useNavigate();

    const handleCreateSession = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            alert("You must be logged in to start a session.");
            return;
        }

        const newSessionId = await createNewSession(userId);

        if (newSessionId) {
            navigate(`/session/${newSessionId}`);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Sessions</h1>
                <button
                    onClick={handleCreateSession}
                    style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '8px' }}
                >
                    Create Session
                </button>
            </div>
            <p>Here you can view and manage your past workout sessions.</p>
        </div>
    );
}

export default Sessions;