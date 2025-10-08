import React from 'react';
import logs from '../data/logs.js';
import DevLogItem from '../components/DevLogItem.jsx';

function DevLog() {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-white">Development Log</h1>
            <div>
                {logs.map((log) => (
                    <DevLogItem key={log.version} log={log} />
                ))}
            </div>
        </div>
    );
}

export default DevLog;