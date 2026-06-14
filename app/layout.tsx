import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELECTION COMMAND | TACTICAL OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Geist:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-background font-command-label selection:bg-primary-container selection:text-on-primary-fixed scanlines overflow-hidden h-screen">
        <div className="scanline-sweep" />
        <header className="fixed top-0 p-2 w-full z-50 flex justify-between items-center px-md h-16 bg-transparent">
          <div className="flex items-center px-md">
            <span className="font-display-header text-lg text-primary-container tracking-widest uppercase">
              ELECTION COMMAND
            </span>
          </div>
        </header>
        {children}
        <footer className="fixed bottom-0 left-0 w-full z-50 p-md flex items-center bg-gradient-to-t from-background to-transparent pointer-events-none p-2">
          <button
            type="button"
            className="pointer-events-auto bg-primary-container/20 border border-primary-container text-primary-container font-bold text-xs px-md p-2 rounded active:scale-95 transition-transform uppercase flex items-center gap-sm"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
        </footer>
      </body>
    </html>
  );
}
