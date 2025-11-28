// components/DashboardLayout.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Contenu principal avec marge pour la navbar */}
      <main className="min-h-screen">
        {/* Contenu de la page */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
