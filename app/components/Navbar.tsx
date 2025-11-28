"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { NavbarProps } from "../types";
import {
  DashboardIcon,
  BuildingIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../components/Icons"; 

export default function Navbar({ collapsed, setCollapsed }:NavbarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();
  

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      href: "/",
      label: "Tableau de Bord",
      icon: <DashboardIcon className="w-5 h-5" />,
    },
    {
      href: "/agencies",
      label: "Agences",
      icon: <BuildingIcon className="w-5 h-5" />,
    },
    {
      href: "/contacts",
      label: "Contacts",
      icon: <UsersIcon className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Loading state
  if (!mounted || !isLoaded) {
    return (
      <nav
        className={`fixed left-0 top-0 h-full bg-white/95 shadow-2xl border-r border-gray-200/60 z-40 backdrop-blur-lg transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-gray-200/60">
          {!collapsed && (
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          )}
        </div>
        <ul className="mt-6 space-y-2 px-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <div
                className={`flex items-center rounded-xl bg-gray-100 animate-pulse ${
                  collapsed ? "justify-center p-3" : "p-3"
                }`}
              >
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                {!collapsed && (
                  <div className="h-4 bg-gray-300 rounded w-20 ml-3"></div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed left-0 top-0 h-full bg-white/95 shadow-2xl border-r border-gray-200/60 z-40 backdrop-blur-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header avec bouton collapse */}
      <div className="p-4 border-b border-gray-200/60 relative">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ${
              collapsed ? "mx-auto" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation Items */}
      <ul className="mt-6 px-2">
        {navItems.map((item, index) => {
          const active = isActive(item.href);

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              {/* Indicateur de page active */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Effet de hover */}
              <AnimatePresence>
                {hoveredItem === item.href && !active && (
                  <motion.div
                    className="absolute inset-0 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              <Link
                href={item.href}
                className={`relative flex items-center transition-all duration-200 rounded-lg group ${
                  collapsed ? "justify-center p-3" : "p-3 mx-2"
                } ${
                  active
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {/* Background gradient pour l'item actif */}
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md"
                    layoutId="activeBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icône */}
                <motion.div
                  className={`relative z-10 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.div>

                {/* Texte - seulement visible quand non collapsed */}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="relative z-10 font-medium ml-3 text-sm"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Tooltip au hover quand collapsed */}
              <AnimatePresence>
                {collapsed && hoveredItem === item.href && (
                  <motion.div
                    className="absolute left-full top-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50"
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                    <div className="absolute right-full top-1/2 w-0 h-0 border-t-2 border-b-2 border-l-0 border-r-2 border-r-gray-900 border-t-transparent border-b-transparent -translate-y-1/2"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>

      {/* Section utilisateur en bas */}
      <div className="absolute bottom-4 left-2 right-2">
        <motion.div
          className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden ${
            collapsed ? "p-2" : "p-3"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {/* Informations utilisateur - seulement visible quand non collapsed */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="flex-1 min-w-0 mr-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.primaryEmailAddress?.emailAddress.split("@")[0]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* UserButton */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UserButton
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border-2 border-indigo-200",
                    userButtonTrigger: "focus:shadow-md",
                  },
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
