import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { updateSession } from '../utils/sessionUtils';
import GraphFilters from './GraphFilters';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function VolumeGraph({ sessionVolume, session, sessionId, filters, onFilterChange }) {

    const isCollapsed = session?.uiState?.graphCollapsed ?? false;

    const handleToggleCollapse = () => {
        if (!sessionId) return;
        updateSession(sessionId, { "uiState.graphCollapsed": !isCollapsed });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Session Volume' },
        },
        // This is the key to making the chart stacked
        scales: {
            x: { stacked: true },
            y: { stacked: true },
        },
    };

    const filteredVolumeEntries = Object.entries(sessionVolume).filter(
        ([key, value]) => (value.primary + value.secondary + value.goal) > 0
    );

    filteredVolumeEntries.sort(([, a], [, b]) => {
        const totalA = a.primary + a.secondary + a.goal;
        const totalB = b.primary + b.secondary + b.goal;
        return totalB - totalA; // Sorts in descending order
    });

    const labels = filteredVolumeEntries.map(([key, value]) => key);

    const data = {
        labels,
        datasets: [
            // Dataset for Primary volume
            {
                label: 'Primary',
                data: filteredVolumeEntries.map(([key, value]) => value.primary),
                backgroundColor: 'rgba(129, 140, 248, 0.7)', // Indigo
            },
            // NEW: Dataset for Secondary volume
            {
                label: 'Secondary',
                data: filteredVolumeEntries.map(([key, value]) => value.secondary),
                backgroundColor: 'rgba(52, 211, 153, 0.7)', // Emerald Green
            },
            {
                label: 'Goal',
                data: filteredVolumeEntries.map(([key, value]) => value.goal),
                backgroundColor: 'rgba(251, 191, 36, 0.7)', // Amber Yellow
            },
        ],
    };

    return (
        <div style={{ border: '1px solid #4a5568', borderRadius: '8px' }}>
            {/* Persistent Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#2d3748', borderRadius: isCollapsed ? '8px' : '8px 8px 0 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Session Volume Analysis</h2>
                <button onClick={handleToggleCollapse}>
                    {isCollapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {!isCollapsed && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <GraphFilters filters={filters} onFilterChange={onFilterChange} />
                    <Bar options={options} data={data} />
                </div>
            )}
        </div>
    );
}

export default VolumeGraph;