import React from "react";
import "./globals.css";

export const metadata = {
  title: "Orixa OS — Enterprise Intelligence Operating System",
  description: "Secure, high-concurrency isolated analytical workloads with AI Specialists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#09090b] text-[#fafafa]">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
