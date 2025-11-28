"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");
 
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-end items-center px-8 py-4">
            <UserButton afterSignOutUrl="/login" />
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
