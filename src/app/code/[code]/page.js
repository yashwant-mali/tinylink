// path: src/app/code/[code]/page.js
"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";

const fetcher = (url) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Fetch error: " + r.status);
        return r.json();
    });

export default function CodeStatsPage() {
    const params = useParams();
    const code = params?.code; // safe client-side

    const { data, error, isLoading, mutate } = useSWR(
        code ? `/api/links/${encodeURIComponent(code)}` : null,
        fetcher
    );

    useEffect(() => {
        // optional: revalidate when code changes
        if (code) mutate();
    }, [code, mutate]);

    if (!code) return <div style={{ padding: 24 }}>Loading...</div>;
    if (isLoading) return <div style={{ padding: 24 }}>Loading stats…</div>;
    if (error) return <div style={{ padding: 24, color: "crimson" }}>Failed to load stats</div>;
    if (!data) return <div style={{ padding: 24 }}>No data</div>;

    return (
        <main style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Stats for <code>{data.code}</code></h1>

            <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
                <p><strong>Target URL:</strong> <a href={data.url} target="_blank" rel="noreferrer">{data.url}</a></p>
                <p><strong>Total clicks:</strong> {data.clicks}</p>
                <p><strong>Last clicked:</strong> {data.lastClicked ? new Date(data.lastClicked).toLocaleString() : "Never"}</p>
                <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/${data.code}`)}>
                        Copy short URL
                    </button>
                    <button onClick={() => mutate()}>Refresh</button>
                </div>
            </div>
        </main>
    );
}