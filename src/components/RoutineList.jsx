function RoutineList({ routines, onDelete, onEdit }) {
    console.log('Routines data:', routines);
    if (routines.length === 0) {
        return <p>You haven't created any routines yet. Click "Add Routine" to get started!</p>;
    }

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {routines.map((routine, index) => (
                <div
                    key={routine.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderBottom: index < routines.length - 1 ? '1px solid #4a5568' : 'none'
                    }}
                >
                    <div>
                        <p style={{ fontWeight: 'bold' }}>{routine.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
                            {routine.categories.join(', ')}
                        </p>
                    </div>
                    <div>
                        <button onClick={() => onEdit(routine)} style={{ marginRight: '8px' }}>Edit</button>
                        <button onClick={() => onDelete(routine.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RoutineList;