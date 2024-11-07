import { useState } from 'react';

export default function useLogger() {
    const [log, setLog] = useState<string[]>([]);

    function logger(line: string) {
        const currentLog = log;
        setLog([line, ...currentLog]);
    }

    return { log, logger };
}
