function GraphFilters({ filters, onFilterChange }) {
    // A helper to create a styled button
    const FilterButton = ({ name, value, currentFilter, children }) => {
        const isActive = currentFilter === value;
        return (
            <button
                onClick={() => onFilterChange(name, value)}
                style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    border: '1px solid #4a5568',
                    color: 'white',
                    backgroundColor: isActive ? '#3182ce' : 'transparent'
                }}
            >
                {children}
            </button>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '16px', backgroundColor: '#2d3748', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Metric:</span>
                <FilterButton name="metric" value="sets" currentFilter={filters.metric}>Sets</FilterButton>
                <FilterButton name="metric" value="reps" currentFilter={filters.metric}>Reps</FilterButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Muscle Group:</span>
                <FilterButton name="muscleGroup" value="simple" currentFilter={filters.muscleGroup}>Simple</FilterButton>
                <FilterButton name="muscleGroup" value="specific" currentFilter={filters.muscleGroup}>Specific</FilterButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Range:</span>
                <FilterButton name="range" value="session" currentFilter={filters.range}>Session</FilterButton>
                <FilterButton name="range" value="week" currentFilter={filters.range}>Week</FilterButton>
            </div>
        </div>
    );
}

export default GraphFilters;