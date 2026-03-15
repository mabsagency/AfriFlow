"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

type Summary = {
  balance: number;
  monthlySpending: number;
  monthlyIncome: number;
  savingsRate: number;
  transactionCount: number;
  topCategories: Array<{ categoryId: string | null; name: string; amount: number }>;
  areaData: Array<{ month: string; depenses: number; revenus: number }>;
};

const COLORS = ["#16a34a", "#f97316", "#3b82f6", "#a855f7", "#ef4444"];

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
        <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: 6, fontSize: 13 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: 12, fontWeight: 500 }}>
            {p.name === "revenus" ? "Revenus" : "Dépenses"}: {Number(p.value).toLocaleString("fr-FR")} XAF
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user?.name) setUserName(data.user.name.split(" ")[0]); })
      .catch(() => {});

    fetch("/api/dashboard/summary")
      .then((res) => { if (!res.ok) throw new Error("Non autorisé"); return res.json(); })
      .then((payload) => setSummary(payload))
      .catch((err) => setError(err.message));
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = summary ? [
    {
      label: "Solde Total",
      value: summary.balance.toLocaleString("fr-FR", { minimumFractionDigits: 0 }),
      unit: "XAF",
      trend: summary.balance >= 0 ? "positif" : "négatif",
      trendUp: summary.balance >= 0,
      bg: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      label: "Dépenses du Mois",
      value: summary.monthlySpending.toLocaleString("fr-FR", { minimumFractionDigits: 0 }),
      unit: "XAF",
      trend: `${summary.monthlySpending > 0 ? "actif" : "aucune"}`,
      trendUp: false,
      bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
    },
    {
      label: "Taux Épargne",
      value: summary.savingsRate.toString(),
      unit: "%",
      trend: summary.savingsRate >= 20 ? "excellent" : summary.savingsRate > 0 ? "correct" : "nul",
      trendUp: summary.savingsRate >= 20,
      bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Transactions",
      value: summary.transactionCount.toString(),
      unit: "ce mois",
      trend: `${summary.transactionCount} total`,
      trendUp: true,
      bg: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ] : [];

  // Pie chart uses real category data
  const pieData = summary?.topCategories.filter(c => c.amount > 0).map(c => ({
    name: c.name,
    value: c.amount,
  })) ?? [];

  const maxCatAmount = summary?.topCategories.length
    ? Math.max(...summary.topCategories.map(c => c.amount), 1)
    : 1;

  return (
    <div className="page-content animate-fade-up">

      {/* Top Bar */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bonjour{userName ? `, ${userName}` : ""}</h1>
          <p className="page-subtitle" style={{ textTransform: "capitalize" }}>{today}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 10px rgba(22,163,74,0.35)" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nouvelle transaction</span>
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white transition-all"
            style={{ border: "1px solid var(--surface-border)", background: "white" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Exporter</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl text-sm text-red-700 mb-6 animate-scale-in" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error} — <Link href="/login" className="underline font-medium">Se reconnecter</Link>
        </div>
      )}

      {!summary && !error && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 sm:h-32 rounded-2xl skeleton" />)}
        </div>
      )}

      {summary && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="stat-card animate-fade-up"
                style={{ background: s.bg, animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                    {s.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                    {s.trendUp ? "↑" : "↓"} {s.trend}
                  </span>
                </div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
                <p className="text-white text-2xl font-bold leading-tight">
                  {s.value}<span className="text-sm font-normal ml-1 opacity-70">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Area Chart */}
            <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Revenus vs Dépenses</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Évolution sur 8 mois</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                    <span className="text-xs text-slate-500">Revenus</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f97316" }} />
                    <span className="text-xs text-slate-500">Dépenses</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={summary.areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area type="monotone" dataKey="revenus" stroke="#16a34a" strokeWidth={2.5} fill="url(#colorRevenus)" dot={false} />
                  <Area type="monotone" dataKey="depenses" stroke="#f97316" strokeWidth={2.5} fill="url(#colorDepenses)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart */}
            <div className="p-4 sm:p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">Répartition</h3>
                <p className="text-xs text-slate-400 mt-0.5">Dépenses par catégorie ce mois</p>
              </div>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} XAF`, ""]}
                        contentStyle={{ background: "white", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 10, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {pieData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-slate-600 truncate max-w-[100px]">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{item.value.toLocaleString("fr-FR")} XAF</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
                    <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500">Pas encore de données</p>
                  <p className="text-xs text-slate-400 mt-1">Ajoutez des transactions catégorisées</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Categories */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--surface-border)" }}>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Top Catégories</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Dépenses les plus élevées ce mois</p>
                </div>
                <Link href="/transactions" className="text-sm font-medium text-green-700 hover:text-green-800 flex items-center gap-1">
                  Voir tout
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div>
                {summary.topCategories.length > 0 ? (
                  summary.topCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                      style={{ borderBottom: index < summary.topCategories.length - 1 ? "1px solid var(--surface-border)" : "none" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: COLORS[index % COLORS.length] }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{cat.name}</p>
                        <div className="progress-track mt-2" style={{ height: "4px" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.round((cat.amount / maxCatAmount) * 100)}%`,
                              background: COLORS[index % COLORS.length],
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-red-500 flex-shrink-0">
                        -{cat.amount.toLocaleString("fr-FR")} XAF
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-6">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
                      <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">Aucune transaction pour l&apos;instant</p>
                    <Link href="/transactions" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-50" style={{ border: "1.5px solid rgba(22,163,74,0.25)" }}>
                      Ajouter une transaction
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="p-4 sm:p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
                <h3 className="text-base font-semibold text-slate-900 mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  {[
                    { label: "Ajouter transaction", href: "/transactions", color: "#16a34a", bg: "#f0fdf4" },
                    { label: "Créer un budget", href: "/budgets", color: "#3b82f6", bg: "#eff6ff" },
                    { label: "Voir les rapports", href: "/reports", color: "#a855f7", bg: "#faf5ff" },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                      style={{ background: action.bg, color: action.color }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: action.color }}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wallet Card */}
              <div className="p-6 rounded-2xl text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%, -30%)" }} />
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Solde disponible</p>
                <p className={`text-3xl font-bold mb-1 ${summary.balance < 0 ? "text-red-400" : ""}`}>
                  {summary.balance < 0 ? "" : ""}{summary.balance.toLocaleString("fr-FR")}
                </p>
                <p className="text-white/50 text-sm">XAF · Mobile Money</p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span className="text-white/60 text-sm">Tous les portefeuilles</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-400 font-semibold">+{summary.monthlyIncome.toLocaleString("fr-FR")}</p>
                    <p className="text-xs text-red-400">-{summary.monthlySpending.toLocaleString("fr-FR")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
