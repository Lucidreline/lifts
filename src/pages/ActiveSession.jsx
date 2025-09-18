import { useParams } from 'react-router-dom';

function ActiveSession() {
    const { sessionId } = useParams();

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Active Workout Session</h1>
            <p>You are currently in session:</p>
            <p style={{ fontFamily: 'monospace', marginTop: '8px' }}>{sessionId}</p>
        </div>
    );
}

export default ActiveSession;