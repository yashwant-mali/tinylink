// path: src/app/page.js
"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(r => r.json());

function shortDisplay(url, max = 70) {
  return url.length > max ? url.slice(0, max - 3) + "..." : url;
}

export default function DashboardPage() {
  const { data: links, mutate } = useSWR("/api/links", fetcher);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => setErr(""), [url, code]);

  async function create(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || null })
      });
      if (res.status === 409) {
        setErr("Code already exists");
      } else if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.error || "Failed");
      } else {
        setUrl(""); setCode("");
        await mutate();
      }
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(c) {
    if (!confirm(`Delete ${c}?`)) return;
    await fetch(`/api/links/${c}`, { method: "DELETE" });
    await mutate();
  }

  const items = (links || []).filter(l => {
    if (!q) return true;
    return l.code.includes(q) || l.url.includes(q);
  });

  return (
    <div>
      <section style={{ marginBottom: 18, background: "#fff", padding: 16, borderRadius: 8 }}>
        <form onSubmit={create} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input required placeholder="https://example.com/long/path" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: "1 1 420px", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input placeholder="custom code (optional)" value={code} onChange={e => setCode(e.target.value)} style={{ width: 220, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <button disabled={loading} style={{ padding: "10px 14px", borderRadius: 6 }}>Create</button>
        </form>
        {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
      </section>

      <section style={{ marginBottom: 12 }}>
        <input placeholder="Search by code or URL" value={q} onChange={e => setQ(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
      </section>

      <section style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}><th style={{ padding: 8 }}>Code</th><th>Target</th><th>Clicks</th><th>Last clicked</th><th>Actions</th></tr></thead>
          <tbody>
            {(items || []).length === 0 && (<tr><td colSpan="5" style={{ padding: 12 }}>No links</td></tr>)}
            {(items || []).map(l => (
              <tr key={l.code} style={{ borderTop: "1px solid #f5f5f5" }}>
                <td style={{ padding: 8 }}><a href={`/${l.code}`} target="_blank" rel="noreferrer">{l.code}</a></td>
                <td style={{ padding: 8 }} title={l.url}>{shortDisplay(l.url)}</td>
                <td style={{ padding: 8 }}>{l.clicks}</td>
                <td style={{ padding: 8 }}>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/${l.code}`)}>Copy</button>{" "}
                  <button onClick={() => handleDelete(l.code)} style={{ color: "crimson" }}>Delete</button>{" "}
                  <a href={`/code/${l.code}`}>Stats</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}