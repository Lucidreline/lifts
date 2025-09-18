// src/components/ExerciseList.jsx

function ExerciseList({ exercises }) {
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
                        // Add a border between items, but not after the last one
                        borderBottom: index < exercises.length - 1 ? '1px solid #4a5568' : 'none'
                    }}
                >
                    <span>{exercise.name}</span>
                    <div>
                        {/* We will add buttons here later */}
                        <button style={{ marginRight: '8px' }}>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExerciseList;