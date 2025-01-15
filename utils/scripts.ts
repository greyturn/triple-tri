import fs from 'fs';

function getCards(numCards: number = 50) {
    let db = [];

    for (let i = 0; i < numCards; i++) {
        const card = {
            id: crypto.randomUUID(),
            top: Math.floor(Math.random() * 10),
            right: Math.floor(Math.random() * 10),
            left: Math.floor(Math.random() * 10),
            bottom: Math.floor(Math.random() * 10),
        };
        db.push(card);
    }

    return { cards: db };
}

export default function createCardDB(numCards: number = 50) {
    console.log('Running Card DB init...');
    const db = getCards(numCards);

    let dbJson = JSON.stringify(db);

    const now = new Date();
    const date = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}-(${now.getHours()}-${now.getMinutes()}-${now.getSeconds()})`;

    const fileName = `./static/cardlists/cardDB-${date}.json`;

    fs.writeFile(fileName, dbJson, (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log(`Successfully wrote file: ${fileName}`);
        }
    });
}

createCardDB();
