// path: src/app/components/Header.js
"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function Header() {
    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" component="div">TinyLink</Typography>
                    <Typography variant="body2" color="text.secondary">URL shortener</Typography>
                </Box>
                <Box>
                    <Button component={Link} href="/" color="inherit">Dashboard</Button>
                    <Button component="a" href="/healthz" color="inherit">Health</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}