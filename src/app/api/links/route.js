// path: src/app/api/links/route.js
import dbConnect from "@/lib/mongoose";
import Link from "@/models/Link";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(u) {
    try {
        const parsed = new URL(u);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function generateCode(len = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
}

export async function GET() {
    await dbConnect();
    const links = await Link.find({}).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(links), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { url, code: custom } = body ?? {};

    if (!url || typeof url !== "string" || !isValidUrl(url)) {
        return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    let code = custom ? String(custom).trim() : null;
    if (code) {
        if (!CODE_REGEX.test(code)) {
            return new Response(JSON.stringify({ error: "Invalid code. Use [A-Za-z0-9]{6,8}" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        const exists = await Link.findOne({ code }).lean();
        if (exists) return new Response(JSON.stringify({ error: "Code already exists" }), { status: 409, headers: { "Content-Type": "application/json" } });
    } else {
        // generate unique code
        let attempt = 0;
        do {
            code = generateCode(6);
            attempt++;
            if (attempt > 8) code = generateCode(7);
        } while (await Link.findOne({ code }).lean());
    }

    const link = new Link({ code, url });
    await link.save();
    return new Response(JSON.stringify(link), { status: 201, headers: { "Content-Type": "application/json" } });
}