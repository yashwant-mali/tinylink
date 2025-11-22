// path: src/app/healthz/route.js
export async function GET() {
    const payload = { ok: true, version: "1.0" };
    return new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } });
}