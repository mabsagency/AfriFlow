import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfriFlow — Personal Finance for Africa",
  description: "Track spending, budgets, and goals across mobile money platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/afriflow.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="/afriflow.png" type="image/png" sizes="256x256" />
        <link rel="icon" href="/afriflow.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/afriflow.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/afriflow.png" type="image/png" sizes="48x48" />
        <link rel="shortcut icon" href="/afriflow.png" type="image/png" />
        <link rel="apple-touch-icon" href="/afriflow.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/afriflow.png" sizes="512x512" />
        <meta name="msapplication-TileImage" content="/afriflow.png" />
        <meta name="msapplication-TileColor" content="#16a34a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
