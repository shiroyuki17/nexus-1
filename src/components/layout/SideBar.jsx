import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Monitor, CalendarClock, Gamepad2, UtensilsCrossed,
  User, Trophy, Shield, ChevronRight, Zap, LogOut
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { path: "/",            icon: LayoutDashboard, label: "Dashboard" },
  { path: "/pc-status",   icon: Monitor,         label: "PC Status" },
  { path: "/reservations",icon: CalendarClock,   label: "Reservations" },
  { path: "/games",       icon: Gamepad2,        label: "Game Library" },
  { path: "/food-drinks", icon: UtensilsCrossed, label: "Food & Drinks" },
  { path: "/tournaments", icon: Trophy,          label: "Tournaments" },
  { path: "/profile",     icon: User,            label: "Profile" },
  { path: "/admin",       icon: Shield,          label: "Admin" },
];

const COLLAPSED_KEY = "nexus_sidebar_collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSED_KEY) === "true"; } catch { return false; }
  });
  const location = useLocation();

  const toggle = () => {
    setCollapsed(v => {
      try { localStorage.setItem(COLLAPSED_KEY, String(!v)); } catch {}
      return !v;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 228 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 glass flex flex-col select-none overflow-hidden"
      style={{ borderRight: "1px solid hsl(224 20% 14% / 0.8)" }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 shrink-0" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.8)" }}>
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 neon-glow-pink">
          <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="ml-2.5 overflow-hidden whitespace-nowrap"
            >
              <span className="font-display text-[13px] font-bold text-primary neon-text-cyan tracking-wider">
                NEXUS ARENA
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-1.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block">
              <div className={`
                relative flex items-center h-9 rounded-lg px-2.5 gap-2.5
                transition-all duration-150 group
                ${isActive
                  ? "sidebar-active-bg text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }
              `}>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full neon-glow-pink"
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}

                <item.icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${isActive ? "text-primary" : "group-hover:text-foreground"}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      className="text-[13px] font-medium whitespace-nowrap leading-none"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pb-2 px-1.5 space-y-0.5 shrink-0" style={{ borderTop: "1px solid hsl(224 20% 12% / 0.8)" }}>
        <div className="pt-1.5" />
        <button
          onClick={() => base44.auth.logout("/")}
          className="relative flex items-center h-9 w-full rounded-lg px-2.5 gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-150 group"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="text-[13px] font-medium whitespace-nowrap"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggle}
          className="flex items-center justify-center h-8 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-150"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.22 }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
