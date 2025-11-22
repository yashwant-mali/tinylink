// path: src/app/components/AddLinkForm.js
"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

export default function AddLinkForm({ onCreated }) {
    const [url, setUrl] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, code: code || null })
            });
            if (res.status === 201) {
                setUrl(""); setCode("");
                setMsg({ text: "Created", severity: "success" });
                onCreated && onCreated();
            } else {
                const j = await res.json().catch(() => ({}));
                setMsg({ text: j.error || "Failed", severity: "error" });
            }
        } catch (err) {
            setMsg({ text: "Network error", severity: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Long URL"
                    placeholder="https://example.com/very/long/path"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Custom code (optional)"
                    placeholder="6-8 chars"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    size="small"
                    sx={{ width: { xs: "100%", sm: 220 } }}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </Stack>

            <Snackbar
                open={!!msg}
                autoHideDuration={3000}
                onClose={() => setMsg(null)}
                message={msg?.text}
            />
        </Box>
    );
}