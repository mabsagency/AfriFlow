"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "Rapports",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const AUTH_ROUTES = ["/", "/login", "/register"];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isAuthRoute) {
      fetch("/api/auth/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user?.name) setUserName(data.user.name);
          else if (data?.user?.email) setUserName(data.user.email.split("@")[0]);
        })
        .catch(() => {});
    }
  }, [isAuthRoute]);

  if (isAuthRoute) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade-in"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="fixed top-3.5 left-3.5 z-50 lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
        style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", border: "1px solid rgba(15,23,42,0.08)" }}
      >
        {mobileOpen ? (
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:h-screen lg:flex-shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          minWidth: "260px",
          background: "#ffffff",
          borderRight: "1px solid rgba(15,23,42,0.07)",
          boxShadow: "2px 0 16px rgba(15,23,42,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
          <div className="flex-shrink-0">
            <Image
              src="/afriflow.png"
              alt="AfriFlow"
              width={52}
              height={52}
              className="object-contain rounded-xl"
            />
          </div>
          <div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #15803d, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AfriFlow
            </span>
            <p className="text-xs text-slate-400 leading-tight">Finance Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: "#b0bec5", letterSpacing: "0.1em" }}>Navigation</p>
          <div className="space-y-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 relative group"
                  style={
                    active
                      ? { background: "#f0fdf4", color: "#15803d", fontWeight: 600 }
                      : { color: "#64748b", fontWeight: 500 }
                  }
                >
                  {/* Active left bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                      style={{ background: "#16a34a" }}
                    />
                  )}
                  <span
                    className="flex-shrink-0 transition-colors duration-150"
                    style={{ color: active ? "#16a34a" : "#94a3b8" }}
                  >
                    {link.icon}
                  </span>
                  <span className="flex-1">{link.label}</span>
                  {active && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "#16a34a", opacity: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="px-4 pb-5" style={{ borderTop: "1px solid rgba(15,23,42,0.06)", paddingTop: "1rem" }}>
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-2"
            style={{ background: "#f8fafc" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #16a34a, #f97316)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{userName || "Mon compte"}</p>
              <p className="text-xs text-slate-400">Compte gratuit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
