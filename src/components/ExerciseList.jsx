// The component now accepts `onEdit` and `onDelete` props
function ExerciseList({ exercises, onEdit, onDelete }) {
    if (exercises.length === 0) {
        return <p>You haven't added any exercises yet. Click "Add Exercise" to get started!</p>;
    }

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {exercises.map((exercise, index) => (
                <div
                    key={exercise.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderBottom: index < exercises.length - 1 ? '1px solid #4a5568' : 'none'
                    }}
                >
                    <span>{exercise.name}</span>
                    <div>
                        {/* The onClick handler now calls the onEdit prop with the entire exercise object */}
                        <button onClick={() => onEdit(exercise)} style={{ marginRight: '8px' }}>Edit</button>
                        <button onClick={() => onDelete(exercise.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExerciseList;