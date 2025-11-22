// path: src/app/layout.js
import "../styles/global.css";

export const metadata = {
  title: "TinyLink",
  description: "Simple URL shortener"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: 16, borderBottom: "1px solid #eee", background: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0 }}>TinyLink</h1>
            <nav>
              <a href="/" style={{ marginRight: 12 }}>Dashboard</a>
              <a href="/healthz">Health</a>
            </nav>
          </div>
        </header>
        <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>{children}</main>
        <footer style={{ textAlign: "center", padding: 18, color: "#666" }}>TinyLink • simple URL shortener</footer>
      </body>
    </html>
  );
}