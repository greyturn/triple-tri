import fs from 'fs';
import { useEffect, useState } from 'react';

interface Props {
    setCardDb: any;
}

export default function ChooseCardDb({ setCardDb }: Props) {
    const [cardFiles, setCardFiles] = useState<string[]>([]);

    useEffect(() => {}, [cardFiles]);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor='carddb-select'>Select Card DB</label>
            <select
                id='carddb-select'
                value={cardFiles}
                onChange={(e) => {
                    setCardDb(e.target.value);
                }}
            ></select>
        </form>
    );
}
