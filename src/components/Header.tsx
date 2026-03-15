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
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/subscriptions",
    label: "Abonnements",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "Rapports",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

// Pages where header should not appear
const AUTH_ROUTES = ["/", "/login", "/register"];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isAuthRoute) {
      fetch("/api/auth/me")
        .then((r) => r.ok ? r.json() : null)
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(15,23,42,0.07)",
        boxShadow: "0 1px 0 rgba(15,23,42,0.04)",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
              <Image
                src="/afriflow.png"
                alt="AfriFlow"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span
              className="text-lg font-bold tracking-tight hidden sm:block"
              style={{
                background: "linear-gradient(135deg, #15803d, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AfriFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                <span style={{ color: isActive(link.href) ? "#16a34a" : "#94a3b8" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Quick add */}
            <Link
              href="/transactions"
              className="btn btn-primary text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </Link>

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-default"
                style={{ background: "linear-gradient(135deg, #16a34a, #f97316)" }}
                title={userName || "Mon compte"}
              >
                {initials}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary text-sm flex items-center gap-1.5"
                title="Déconnexion"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden lg:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-green-50 hover:text-green-700 transition-all"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden pb-4 animate-slide-down"
            style={{ borderTop: "1px solid rgba(15,23,42,0.07)", paddingTop: "0.75rem" }}
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-green-50 text-green-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span style={{ color: isActive(link.href) ? "#16a34a" : "#94a3b8" }}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}

              <div style={{ height: "1px", background: "rgba(15,23,42,0.07)", margin: "8px 4px" }} />

              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #16a34a, #f97316)" }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{userName || "Mon compte"}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-danger text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
