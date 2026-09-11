"use client";

/**
 * FAMILYBRIDGE Global Navigation
 * Themed with Miro.com Design System:
 * - Miro Deep Navy #050038
 * - Miro Electric Blue #4262FF
 * - Miro Accent Yellow #FFD02F
 * - Clean White #FFFFFF with subtle #EBEBEB borders
 * - Modern Bold Sans Typography (Noto Sans)
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Shield,
  FileText,
  Network,
  CheckSquare,
  Sparkles,
  Globe,
  Gift,
  AlertTriangle,
  RotateCcw,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { UserRole } from "@/lib/types";

interface NavbarProps {
  activeRole: UserRole;
  isContinuityMode: boolean;
  onSwitchRole: (role: UserRole) => void;
  onToggleContinuity: (enabled: boolean) => void;
  onResetDemo: () => void;
  onTriggerContinuitySimulation?: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; emoji: string; badgeClass: string }> = {
  primary:  { label: "Father",  emoji: "👨‍💼", badgeClass: "bg-[#EEF2FF] text-[#4262FF] border border-[#C7D4FF]" },
  guardian: { label: "Mother",  emoji: "👩‍💼", badgeClass: "bg-[#FFF9E6] text-[#8C6200] border border-[#FFE082]" },
  child:    { label: "Child",   emoji: "🎓",  badgeClass: "bg-purple-50 text-purple-700 border border-purple-200" },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  isContinuityMode,
  onSwitchRole,
  onToggleContinuity,
  onResetDemo,
  onTriggerContinuitySimulation,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getDashboardPath = (role: UserRole) => {
    if (role === "primary")  return "/dashboard/primary";
    if (role === "guardian") return "/dashboard/guardian";
    return "/dashboard/child";
  };

  const handleRoleSelect = (role: UserRole) => {
    onSwitchRole(role);
    const targetPath = getDashboardPath(role);
    router.push(targetPath);
  };

  const currentDashboardHref = getDashboardPath(activeRole);

  const navItems = [
    { label: "Vault",       href: currentDashboardHref, icon: FileText   },
    { label: "Action Plan", href: "/plan",               icon: CheckSquare },
    { label: "Systems",     href: "/systems",            icon: Globe      },
    { label: "Family Map",  href: "/map",                icon: Network    },
    { label: "Benefits",    href: "/benefits",           icon: Gift       },
    { label: "Ask Vault",   href: "/assistant",          icon: Sparkles   },
  ];

  const roleInfo = ROLE_LABELS[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A] text-[#FAFAFA] shadow-skiff">
      {/* ── Continuity Banner (Skiff Ember / Orange Alert) ── */}
      {isContinuityMode && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-[#FF4405] text-white px-4 py-2 text-xs sm:text-sm font-semibold border-b border-[#EA3800]"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce text-white" aria-hidden="true" />
            <span>
              <strong>EMERGENCY CONTINUITY ACTIVE:</strong> Primary member unavailable. Elevated access granted to Priya Kumar.
            </span>
            <button
              onClick={() => onToggleContinuity(false)}
              className="ml-auto bg-[#0A0A0B] text-[#FAFAFA] hover:bg-[#18181B] border border-[#27272A] px-3 py-1 rounded-md text-xs font-semibold transition shadow-skiff"
            >
              Exit Simulation
            </button>
          </div>
        </div>
      )}

      {/* ── Main Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4405] rounded-lg"
            aria-label="FamilyBridge Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center shadow-skiff group-hover:border-[#FF4405]/50 transition-all">
              <Shield className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-[#FAFAFA]">
                  FAMILYBRIDGE
                </span>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30">
                  Vault
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#18181B] text-[#FAFAFA] border border-[#27272A]"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Current Role Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#18181B] text-[#FAFAFA] border border-[#27272A]">
              <span aria-hidden="true">{roleInfo.emoji}</span>
              {roleInfo.label}
            </span>

            {/* Persona Switcher (Skiff styled segment) */}
            <div
              role="group"
              aria-label="Persona switcher"
              className="flex items-center bg-[#111113] p-0.5 rounded-lg border border-[#27272A] text-xs"
            >
              {(["primary", "guardian", "child"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  aria-pressed={activeRole === role}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                    activeRole === role
                      ? "bg-[#18181B] text-[#FAFAFA] border border-[#27272A] shadow-xs"
                      : "text-[#71717A] hover:text-[#FAFAFA]"
                  }`}
                >
                  {ROLE_LABELS[role].label}
                </button>
              ))}
            </div>

            {/* Emergency Button */}
            {activeRole === "primary" && !isContinuityMode && onTriggerContinuitySimulation && (
              <button
                onClick={onTriggerContinuitySimulation}
                className="hidden md:flex items-center gap-1.5 bg-[#FF4405]/10 hover:bg-[#FF4405]/20 text-[#FF4405] border border-[#FF4405]/30 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">Simulate Emergency</span>
              </button>
            )}

            {/* Reset Demo */}
            <button
              onClick={onResetDemo}
              className="p-2 text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B] rounded-lg transition border border-[#27272A]"
              title="Reset demo data"
              aria-label="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* User Avatar + Dropdown */}
            {session?.user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#18181B] transition border border-[#27272A]"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#FF4405] text-white text-xs font-bold flex items-center justify-center">
                      {session.user.name?.[0] ?? "U"}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-[#71717A]" aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-[#111113] rounded-xl shadow-skiff-lg border border-[#27272A] py-2 z-50 animate-in fade-in"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-[#27272A]">
                      <p className="text-sm font-semibold text-[#FAFAFA] truncate">{session.user.name}</p>
                      <p className="text-xs text-[#71717A] truncate font-mono">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition font-medium"
                      role="menuitem"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-[#FAFAFA] hover:bg-[#18181B] rounded-lg border border-[#27272A] transition"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <nav className="lg:hidden bg-[#0A0A0B] border-t border-[#27272A] px-4 pb-4 pt-2 space-y-2 shadow-skiff-lg">
          {/* Mobile Role Switcher */}
          <div className="p-2 bg-[#111113] rounded-lg border border-[#27272A] space-y-1.5 mb-2">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block px-1">
              Active Persona:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(["primary", "guardian", "child"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    handleRoleSelect(role);
                    setMobileOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-md font-medium text-xs text-center transition ${
                    activeRole === role
                      ? "bg-[#18181B] text-[#FAFAFA] border border-[#27272A] shadow-xs"
                      : "text-[#71717A] hover:text-[#FAFAFA]"
                  }`}
                >
                  {ROLE_LABELS[role].label}
                </button>
              ))}
            </div>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-[#18181B] text-[#FAFAFA] border border-[#27272A]" : "text-[#71717A] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};