import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function VolumeGraph({ sessionVolume }) {
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

    return <Bar options={options} data={data} />;
}

export default VolumeGraph;