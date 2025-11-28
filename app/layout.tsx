"use client";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Navbar from "./components/Navbar"; 
import "./globals.css";
import { useState } from "react";

// export const metadata = {
//   title: "Dashboard App",
//   description: "Application de tableau de bord avec authentification",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className="min-h-screen bg-gray-50">
          {/* Navbar visible sur toutes les pages */}
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

          {/* Header avec UserButton */}
          <div
            className={`flex-1 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex justify-end items-center px-8 py-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </header>

            {/* Contenu de la page */}
            <main className="mt-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
