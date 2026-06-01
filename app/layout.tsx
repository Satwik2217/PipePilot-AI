import "../styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ChatWidget from "../components/ChatWidget";

export const metadata: Metadata = {
  title: "PipePilot AI | Plumbing Lead Capture",
  description: "AI receptionist demo for a plumbing business with lead capture and dashboard-ready layout."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-slate-900">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
