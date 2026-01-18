"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FolderOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "light" | "dark";
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/plans", label: "My Plans", icon: FolderOpen },
    { href: "/create", label: "New Plan", icon: Plus },
  ];

  const isDark = variant === "dark";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-3",
        isDark ? "bg-black/20 backdrop-blur-md" : "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className={cn(
            "font-display font-bold text-lg tracking-wide",
            isDark ? "text-cr-green" : "text-primary"
          )}>
            HOBBY SCOPE
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? isDark
                      ? "bg-cr-green/20 text-cr-green"
                      : "bg-cr-green/10 text-cr-green"
                    : isDark
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-primary hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
