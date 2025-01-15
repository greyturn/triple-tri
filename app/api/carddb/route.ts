import fs from 'fs';
import path from 'path';

export async function GET() {
    const directoryPath = path.join(__dirname, '../../../../../static/cardlists/');
    let responseJson = '';

    const fileNames: string[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(function (file) {
        fileNames.push(file.substring(0, file.indexOf('.')));
    });
    responseJson = JSON.stringify(fileNames);

    return new Response(responseJson || 'error', { status: 200 });
}
