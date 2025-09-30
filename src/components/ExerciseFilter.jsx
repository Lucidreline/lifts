import { useState, useEffect } from 'react';

function ExerciseFilter({ filters, onFilterChange, muscleGroupsData, splitsData }) {
    const [specificOptions, setSpecificOptions] = useState([]);

    // This effect ensures the specific options are populated if the parent state has a simple group selected
    useEffect(() => {
        if (filters.muscleGroup.simple) {
            const selectedGroup = muscleGroupsData.find(group => group.name === filters.muscleGroup.simple);
            setSpecificOptions(selectedGroup ? selectedGroup.specific : []);
        } else {
            setSpecificOptions([]);
        }
    }, [filters.muscleGroup.simple, muscleGroupsData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    const handleMuscleGroupChange = (e) => {
        const { name, value } = e.target; // name will be 'simple' or 'specific'

        const newMuscleGroupState = { ...filters.muscleGroup, [name]: value };

        // If 'simple' is changed, reset 'specific'
        if (name === 'simple') {
            newMuscleGroupState.specific = '';
        }

        onFilterChange({ ...filters, muscleGroup: newMuscleGroupState });
    };


    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Search by Name */}
            <input
                type="text"
                name="search"
                placeholder="Search by name..."
                value={filters.search}
                onChange={handleInputChange}
                style={{ flex: '2 1 200px', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
            />

            {/* Filter by Category */}
            <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                style={{ flex: '1 1 150px', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
            >
                <option value="">All Categories</option>
                {splitsData.map(split => <option key={split} value={split}>{split}</option>)}
            </select>

            {/* Filter by Muscle Group */}
            <select
                name="simple"
                value={filters.muscleGroup.simple}
                onChange={handleMuscleGroupChange}
                style={{ flex: '1 1 150px', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
            >
                <option value="">All Muscle Groups</option>
                {muscleGroupsData.map(group => <option key={group.name} value={group.name}>{group.name}</option>)}
            </select>

            <select
                name="specific"
                value={filters.muscleGroup.specific}
                onChange={handleMuscleGroupChange}
                disabled={!filters.muscleGroup.simple}
                style={{ flex: '1 1 150px', padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}
            >
                <option value="">Any Specific</option>
                {specificOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}

export default ExerciseFilter;