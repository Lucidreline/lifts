import React from 'react';

function DevLogItem({ log }) {
    // A helper component to render a list section only if it has items
    const renderSection = (title, items) => {
        if (!items || items.length === 0) {
            return null; // Don't render anything if the array is empty
        }

        return (
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-300">{title}:</h3>
                <ul className="list-disc list-inside pl-4 text-gray-400">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">{log.version}</h2>
                <p className="text-sm text-gray-500">{log.date}</p>
            </div>

            {renderSection("New Features", log.features)}
            {renderSection("Bugs Destroyed", log.bugs)}
            {renderSection("Other", log.other)}
        </div>
    );
}

export default DevLogItem;