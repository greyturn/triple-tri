import fs from 'fs';
import path from 'path';

type Data = {
    status: string;
    cardFiles: string[];
};

export async function GET() {
    const directoryPath = path.join(__dirname, '../../../../../static/cardlists/');
    const fileNames: string[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(function (file) {
        fileNames.push(file.substring(0, file.indexOf('.')));
    });

    const responseJson = JSON.stringify(fileNames);

    return new Response(responseJson || 'error', { status: 200 });
}
