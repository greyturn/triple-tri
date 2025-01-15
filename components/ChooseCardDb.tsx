import { useEffect, useState, Dispatch, SetStateAction } from 'react';

interface Props {
    cardDb: string;
    setCardDb: Dispatch<SetStateAction<string>>;
}

export default function ChooseCardDb({ cardDb, setCardDb }: Props) {
    const [cardFiles, setCardFiles] = useState<string[]>([]);

    useEffect(() => {
        async function fetchCardFiles() {
            const response = await fetch('/api/carddb');
            const data = await response.json();
            setCardFiles(data);
        }

        fetchCardFiles();
    }, [setCardFiles]);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor='carddb-select'>Select Card DB: </label>
            <select
                id='carddb-select'
                value={cardDb}
                onChange={(e) => {
                    setCardDb(e.target.value);
                }}
            >
                {cardFiles.map((option, i) => {
                    return (
                        <option key={i} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </form>
    );
}
