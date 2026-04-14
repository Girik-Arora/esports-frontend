import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus GG | Esports Management",
  description: "Professional esports tournament and roster management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 flex min-h-screen relative`}>
        <AuthProvider>
          <Sidebar />
          {/* ADDED: pt-16 for mobile spacing, min-w-0 to prevent flexbox blowouts */}
          <main className="flex-1 overflow-y-auto w-full min-w-0 md:pt-0 pt-20 px-4 md:px-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}