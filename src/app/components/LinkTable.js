// path: src/app/components/LinkTable.js
"use client";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BarChartIcon from "@mui/icons-material/BarChart";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

function shortDisplay(url, max = 60) {
    return url.length > max ? url.slice(0, max - 3) + "..." : url;
}

export default function LinkTable({ links = [], onDelete, onCopy }) {
    if (!links.length) {
        return <Typography sx={{ py: 6 }} align="center" color="text.secondary">No links yet</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="links table">
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Target</TableCell>
                        <TableCell>Clicks</TableCell>
                        <TableCell>Last clicked</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {links.map((l) => (
                        <TableRow key={l.code}>
                            <TableCell>
                                <Link href={`/${l.code}`} style={{ textDecoration: "none" }}>{l.code}</Link>
                            </TableCell>
                            <TableCell title={l.url}>
                                <Typography variant="body2">{shortDisplay(l.url)}</Typography>
                            </TableCell>
                            <TableCell>{l.clicks}</TableCell>
                            <TableCell>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}</TableCell>
                            <TableCell align="right">
                                <Tooltip title="Copy short URL">
                                    <IconButton size="small" onClick={() => onCopy(l.code)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Stats">
                                    <IconButton size="small" component={Link} href={`/code/${l.code}`}>
                                        <BarChartIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton size="small" onClick={() => onDelete(l.code)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}