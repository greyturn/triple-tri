import fs from 'fs';

export async function GET() {
    console.log(process.cwd())
    const directoryPath = `${process.cwd()}/static/cardlists/`;
    let responseJson = '';

    const fileNames: string[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(function (file) {
        fileNames.push(file.substring(0, file.indexOf('.')));
    });
    responseJson = JSON.stringify(fileNames);

    return new Response(responseJson || 'error', { status: 200 });
}
