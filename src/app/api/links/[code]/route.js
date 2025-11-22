// path: src/app/api/links/[code]/route.js
import dbConnect from "@/lib/mongoose";
import Link from "@/models/Link";

/**
 * Safely unwrap the context.params which in some Next versions may be a Promise.
 */
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
    console.log("[API GET] code param:", code);

    if (!code) {
        return new Response(JSON.stringify({ error: "Missing code param" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const link = await Link.findOne({ code }).lean();
    if (!link) {
        const ci = await Link.findOne({ code: new RegExp("^" + code + "$", "i") }).lean();
        if (ci) return new Response(JSON.stringify(ci), { status: 200, headers: { "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(link), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req, context) {
    await dbConnect();
    const params = await getParams(context);
    const code = params?.code;
    console.log("[API DELETE] code param:", code);

    if (!code) {
        console.log("[API DELETE] missing code param");
        return new Response(JSON.stringify({ error: "Missing code param" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    let link = await Link.findOne({ code }).lean();
    if (!link) {
        link = await Link.findOne({ code: new RegExp("^" + code + "$", "i") }).lean();
        if (link) console.log("[API DELETE] found by case-insensitive match:", link.code);
    }

    if (!link) {
        console.log("[API DELETE] not found in DB for code:", code);
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    await Link.deleteOne({ _id: link._id });
    console.log("[API DELETE] deleted:", link.code);
    return new Response(null, { status: 204 });
}