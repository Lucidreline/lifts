import { useState } from 'react';
import AddExerciseModal from '../components/AddExerciseModal'; // 1. Import the modal

function Exercises() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Exercises</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Add Exercise
                </button>
            </div>

            <p>Browse and manage your list of exercises here.</p>

            {/* 2. Render the modal component */}
            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default Exercises;