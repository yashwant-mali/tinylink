"use client";

// path: src/app/layout.js
import "../app/globals.css";


import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./components/Header";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
  },
  components: {
    MuiTableCell: { defaultProps: { padding: "normal" } }
  }
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}