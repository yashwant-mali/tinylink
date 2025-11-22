// path: src/app/code/[code]/page.js
"use client";
import useSWR from "swr";
import { useParams } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function CodeStats() {
    const params = useParams();
    const code = params?.code;
    const { data, error, isLoading, mutate } = useSWR(code ? `/api/links/${encodeURIComponent(code)}` : null, fetcher);

    if (!code) return <div>Loading...</div>;
    if (isLoading) return <div>Loading…</div>;
    if (error) return <div style={{ color: "crimson" }}>Failed to load stats</div>;
    if (!data) return <div>No data</div>;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Stats — <code>{data.code}</code></Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Target URL:</strong> <a href={data.url} target="_blank" rel="noreferrer">{data.url}</a></Typography>
                <Typography sx={{ mt: 1 }}><strong>Total clicks:</strong> {data.clicks}</Typography>
                <Typography sx={{ mt: 1 }}><strong>Last clicked:</strong> {data.lastClicked ? new Date(data.lastClicked).toLocaleString() : "Never"}</Typography>
                <Typography sx={{ mt: 1 }}><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${data.code}`)}>Copy short URL</Button>
                    <Button variant="contained" onClick={() => mutate()}>Refresh</Button>
                </Stack>
            </CardContent>
        </Card>
    );
}