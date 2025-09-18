// src/components/AddExerciseModal.jsx

function AddExerciseModal({ isOpen, onClose }) {
    // If the modal isn't open, return nothing
    if (!isOpen) return null;

    return (
        // Main container - fixed position, covers the whole screen
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Modal content box */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Add a New Exercise</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                {/* The form will go here in the next step */}
                <p className="text-gray-300">Form content will be built next...</p>

            </div>
        </div>
    );
}

export default AddExerciseModal;