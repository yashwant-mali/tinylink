// path: src/app/page.js
"use client";
import React, { useState } from "react";
import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddLinkForm from "./components/AddLinkForm";
import LinkTable from "./components/LinkTable";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const fetcher = (u) => fetch(u).then((r) => r.json());

export default function Dashboard() {
  const { data: links = [], error, mutate } = useSWR("/api/links", fetcher);
  const [q, setQ] = useState("");

  function filtered() {
    if (!q) return links;
    const ql = q.toLowerCase();
    return links.filter((l) => l.code.toLowerCase().includes(ql) || l.url.toLowerCase().includes(ql));
  }

  async function handleDelete(code) {
    if (!confirm(`Delete ${code}?`)) return;
    await fetch(`/api/links/${encodeURIComponent(code)}`, { method: "DELETE" });
    mutate();
  }

  function copyShort(code) {
    const base = (typeof window !== "undefined" && window.location.origin) || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const short = `${base}/${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(short);
    alert("Copied: " + short);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">Create and manage your short links</Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <TextField size="small" placeholder="Search code or url" value={q} onChange={(e) => setQ(e.target.value)} />
              <IconButton onClick={() => mutate()}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <AddLinkForm onCreated={() => mutate()} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <LinkTable links={filtered()} onDelete={handleDelete} onCopy={copyShort} />
        </Paper>
      </Grid>
    </Grid>
  );
}