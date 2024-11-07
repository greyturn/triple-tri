import { useState } from 'react';

export default function useLogger() {
    const [log, setLog] = useState<string[]>([]);

    function logger(line: string) {
        setLog((oldLog) => [line, ...oldLog]);
    }

    return { log, logger };
}
