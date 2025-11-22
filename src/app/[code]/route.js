// path: src/app/[code]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Link from "@/models/Link";

async function getParams(context) {
    if (!context) return {};
    const ctx = typeof context.then === "function" ? await context : context;
    if (!ctx) return {};
    if (ctx.params && typeof ctx.params.then === "function") {
        return await ctx.params;
    }
    return ctx.params || {};
}

export async function GET(req, context) {
    await dbConnect();
    const params = await getParams(context);
    const code = params?.code;
    console.log("[REDIRECT] code param:", code);

    if (!code) {
        return new NextResponse(JSON.stringify({ error: "Missing code param" }), { status: 400 });
    }

    // exact match
    let link = await Link.findOne({ code }).lean();
    // fallback: case-insensitive
    if (!link) {
        link = await Link.findOne({ code: new RegExp("^" + code + "$", "i") }).lean();
        if (link) console.log("[REDIRECT] found by case-insensitive:", link.code);
    }

    if (!link) {
        console.log("[REDIRECT] not found for code:", code);
        return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    // increment clicks and update lastClicked (fire-and-forget)
    try {
        Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 }, $set: { lastClicked: new Date() } }).catch(err => console.error(err));
    } catch (e) {
        console.error("failed to update clicks:", e);
    }

    return NextResponse.redirect(link.url, 302);
}