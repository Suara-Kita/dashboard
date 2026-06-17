import type { Metadata } from "next";
import "./globals.css";
import TelemetryStats from "@/components/TelemetryStats";

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
          <TelemetryStats />
        </header>
        {children}
      </body>
    </html>
  );
}
