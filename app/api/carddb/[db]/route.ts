import fs from 'fs';

export async function GET(_req: Request, context: { params: { db: string } }) {
    const filename = context.params.db;
    const directoryPath = `${process.cwd()}/static/cardlists/`
    let responseJson = '';

    if (!filename) {
        return new Response(responseJson || 'error', { status: 200 });
    }

    const data = JSON.parse(fs.readFileSync(`${directoryPath}${filename}.json`, 'utf8'));

    responseJson = JSON.stringify(data);

    return new Response(responseJson || 'error', { status: 200 });
}
