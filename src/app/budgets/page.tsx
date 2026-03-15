"use client";

import React, { useEffect, useState } from "react";

type Budget = {
  id: string;
  category?: { name: string } | null;
  year: number;
  month: number;
  amount: number;
};

const MOCK_USED_PCT = [65, 88, 32, 71, 50, 20];

function getStatusColor(pct: number) {
  if (pct >= 90) return { bar: "#ef4444", badge: "#fef2f2", badgeText: "#dc2626" };
  if (pct >= 70) return { bar: "#f59e0b", badge: "#fffbeb", badgeText: "#d97706" };
  return { bar: "#16a34a", badge: "#f0fdf4", badgeText: "#15803d" };
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    amount: "",
  });

  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      if (!res.ok) throw new Error("Échec du chargement des budgets");
      const data = await res.json();
      setBudgets(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });
      if (!res.ok) throw new Error("Impossible de créer le budget");
      setShowForm(false);
      setFormData({ categoryId: "", year: new Date().getFullYear(), month: new Date().getMonth() + 1, amount: "" });
      fetchBudgets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getMonthName = (month: number) =>
    new Date(2024, month - 1, 1).toLocaleString("fr-FR", { month: "long" });

  const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const avgUsed = budgets.length ? Math.round(MOCK_USED_PCT.slice(0, budgets.length).reduce((a, b) => a + b, 0) / budgets.length) : 0;

  return (
    <div className="page-content animate-fade-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Définissez et suivez vos plafonds de dépenses mensuels.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nouveau Budget</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl text-sm text-red-700 mb-6 animate-scale-in" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Summary Banner */}
      {budgets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { label: "Budget total ce mois", value: `${totalBudget.toLocaleString("fr-FR")} XAF`, icon: "💰", bg: "linear-gradient(135deg, #16a34a, #15803d)", text: "white" },
            { label: "Nombre de budgets", value: budgets.length.toString(), icon: "📊", bg: "linear-gradient(135deg, #3b82f6, #2563eb)", text: "white" },
            { label: "Utilisation moyenne", value: `${avgUsed}%`, icon: "📈", bg: "linear-gradient(135deg, #f97316, #ea580c)", text: "white" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-2xl text-white" style={{ background: s.bg }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{s.label}</p>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="p-6 rounded-2xl mb-8 animate-scale-in" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-md)" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f0fdf4" }}>
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">Créer un Budget</h2>
            </div>
            <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Année</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Mois</label>
                <select value={formData.month} onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })} className="input-field">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Montant (XAF)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm pointer-events-none">XAF</span>
                  <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="input-field" placeholder="0" required style={{ paddingLeft: "3.5rem" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
                Créer le budget
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all" style={{ border: "1px solid var(--surface-border)" }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl skeleton" />)}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: "white", border: "1px dashed var(--surface-border)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucun budget</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Créez votre premier budget pour commencer à surveiller vos plafonds de dépenses.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer mon premier budget
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((budget, i) => {
            const usedPct = MOCK_USED_PCT[i % MOCK_USED_PCT.length];
            const { bar, badge, badgeText } = getStatusColor(usedPct);
            const usedAmount = (Number(budget.amount) * usedPct) / 100;

            return (
              <div
                key={budget.id}
                className="p-6 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-green-700" style={{ background: "var(--brand-50)" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badge, color: badgeText }}>
                    {usedPct}% utilisé
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mb-0.5">
                  {budget.category?.name || "Budget Global"}
                </h3>
                <p className="text-xs text-slate-400 mb-5 capitalize">{getMonthName(budget.month)} {budget.year}</p>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-900">
                    {usedAmount.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
                    <span className="text-sm font-normal text-slate-400 ml-1">XAF</span>
                  </span>
                  <span className="text-sm text-slate-400">/ {Number(budget.amount).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} XAF</span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${usedPct}%`, background: bar }} />
                </div>

                <p className="text-xs mt-3 font-medium" style={{ color: badgeText }}>
                  {usedPct >= 90
                    ? "⚠ Budget presque épuisé"
                    : `${(Number(budget.amount) - usedAmount).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} XAF restants`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
