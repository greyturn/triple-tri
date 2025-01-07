import { useState } from 'react';

type MessageType = 'ERROR' | 'INFO';
interface LogMessage {
    message: string;
    timestamp: string;
    type: MessageType;
}

export default function useLogger() {
    const [log, setLog] = useState<LogMessage[]>([]);

    function logMessage(message: string, type: MessageType = 'INFO') {
        const date = new Date();
        const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds().toString().padStart(2, '0')}`;
        const newLog = { message, type, timestamp };

        setLog((oldLog) => [newLog, ...oldLog]);
    }

    return { log, logMessage };
}
