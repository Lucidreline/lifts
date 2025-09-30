import { useNavigate } from 'react-router-dom';

function SessionList({ sessions }) {
    const navigate = useNavigate();

    const handleView = (sessionId) => {
        navigate(`/session/${sessionId}`);
    };

    if (sessions.length === 0) {
        return <p>You haven't completed any sessions yet.</p>;
    }

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {sessions.map((session, index) => (
                <div
                    key={session.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderBottom: index < sessions.length - 1 ? '1px solid #4a5568' : 'none'
                    }}
                >
                    <span>
                        {/* Timestamps from Firestore need to be converted to a Date object */}
                        Session from {session.startDate ? new Date(session.startDate.seconds * 1000).toLocaleDateString() : '...'}
                    </span>
                    <div>
                        <button onClick={() => handleView(session.id)} style={{ marginRight: '8px' }}>View</button>
                        <button>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SessionList;