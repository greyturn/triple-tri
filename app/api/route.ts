type Data = {
    status: string;
};

export async function GET() {
    return new Response('ok', { status: 200 });
}
