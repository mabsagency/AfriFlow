"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  type: "DEBIT" | "CREDIT";
  description?: string;
  occurredAt: string;
  category?: { name: string } | null;
  wallet?: { name: string; provider: string } | null;
};

// Resolve logo from provider enum + wallet name
const getProviderLogo = (provider: string, walletName?: string): string => {
  switch (provider) {
    case "MTN_MONEY":    return "/mtn.jpg";
    case "ORANGE_MONEY": return "/Orange.png";
    case "PAYSIKA":      return "/paysika.jpg";
    case "NEERO":        return "/neero.jpg";
    case "OTHER":
      if (walletName === "Autres dépenses" || walletName === "Autres") return "/depenses.jpg";
      if (walletName === "Chariow") return "/chariow.png";
      return "/depenses.jpg"; // fallback générique
    default:
      return "/depenses.jpg";
  }
};

const getProviderLabel = (provider: string, walletName?: string): string => {
  // Known wallet names from the form
  if (walletName && walletName !== "Primary wallet") return walletName;
  switch (provider) {
    case "MTN_MONEY":    return "MTN Money";
    case "ORANGE_MONEY": return "Orange Money";
    case "PAYSIKA":      return "Paysika";
    case "NEERO":        return "Neero";
    default:             return "Autre";
  }
};

const PROVIDERS = [
  { key: "MTN_MONEY",    label: "MTN Money",       logo: "/mtn.jpg",      color: "#f59e0b" },
  { key: "ORANGE_MONEY", label: "Orange Money",    logo: "/Orange.png",   color: "#f97316" },
  { key: "PAYSIKA",      label: "Paysika",         logo: "/paysika.jpg",  color: "#3b82f6" },
  { key: "NEERO",        label: "Neero",           logo: "/neero.jpg",    color: "#8b5cf6" },
  { key: "OTHER",        label: "Chariow",         logo: "/chariow.png",  color: "#16a34a" },
  { key: "DEPENSES",     label: "Autres dépenses", logo: "/depenses.jpg", color: "#64748b" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"DEBIT" | "CREDIT">("DEBIT");
  const [provider, setProvider] = useState<string>("MTN_MONEY");
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(
    () => transactions.reduce((sum, txn) => sum + (txn.type === "DEBIT" ? -Number(txn.amount) : Number(txn.amount)), 0),
    [transactions]
  );
  const totalIncome = useMemo(() => transactions.filter(t => t.type === "CREDIT").reduce((s, t) => s + Number(t.amount), 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "DEBIT").reduce((s, t) => s + Number(t.amount), 0), [transactions]);

  useEffect(() => {
    // Silently migrate old "Primary wallet" names on first load
    fetch("/api/wallets", { method: "PATCH" }).catch(() => {});

    fetch("/api/transactions")
      .then((res) => { if (!res.ok) throw new Error("Non autorisé"); return res.json(); })
      .then((payload) => setTransactions(payload.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type, description, provider }),
      });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload?.error ?? "Impossible d'ajouter la transaction");
        return;
      }
      const payload = await res.json();
      // payload.data now includes wallet + category from the updated API
      setTransactions((current) => [payload.data, ...current]);
      setAmount("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-fade-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Enregistrez et suivez tous vos paiements.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="hidden sm:inline">Importer depuis Wallet</span>
        </button>
      </div>

      {/* Summary mini cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Revenus",   value: totalIncome,          color: "#16a34a", bg: "#f0fdf4", icon: "↑" },
          { label: "Dépenses",  value: totalExpense,         color: "#ef4444", bg: "#fef2f2", icon: "↓" },
          { label: "Net",       value: Math.abs(total),      color: total >= 0 ? "#16a34a" : "#ef4444", bg: total >= 0 ? "#f0fdf4" : "#fef2f2", icon: total >= 0 ? "+" : "−" },
        ].map((s) => (
          <div key={s.label} className="p-3 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium truncate">{s.label}</p>
              <p className="text-sm sm:text-lg font-bold leading-tight" style={{ color: s.color }}>
                {s.value.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-400">XAF</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── Add Transaction Form ──────────────────────────── */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl h-fit" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f0fdf4" }}>
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900">Nouvelle Transaction</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">

            {/* Type toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Type</label>
              <div className="flex rounded-xl p-1 gap-1" style={{ background: "var(--surface-2)" }}>
                {(["DEBIT", "CREDIT"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={
                      type === t
                        ? { background: "white", color: t === "DEBIT" ? "#ef4444" : "#16a34a", boxShadow: "var(--shadow-xs)" }
                        : { color: "#94a3b8" }
                    }
                  >
                    {t === "DEBIT" ? "Dépense" : "Revenu"}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Provenance</label>
              <div className="grid grid-cols-3 gap-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setProvider(p.key)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center"
                    style={
                      provider === p.key
                        ? { borderColor: p.color, background: `${p.color}18` }
                        : { borderColor: "transparent", background: "var(--surface-1)" }
                    }
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.logo} alt={p.label} width={36} height={36} className="object-cover w-full h-full" />
                    </div>
                    <span className="text-xs font-medium leading-tight" style={{ color: provider === p.key ? p.color : "#64748b" }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Montant (XAF)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm font-medium pointer-events-none">XAF</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0"
                  className="input-field"
                  style={{ paddingLeft: "3.5rem" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="ex. déjeuner, recharge airtime…"
                className="input-field"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-700 animate-scale-in" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: submitting
                  ? "#86efac"
                  : type === "DEBIT"
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: submitting ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ajout en cours…
                </span>
              ) : (
                `Ajouter ${type === "DEBIT" ? "la dépense" : "le revenu"}`
              )}
            </button>
          </form>
        </div>

        {/* ── Transaction List ──────────────────────────────── */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5" style={{ borderBottom: "1px solid var(--surface-border)" }}>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Activité Récente</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} · Net&nbsp;
                <span className={`font-semibold ${total >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {total >= 0 ? "+" : ""}{total.toLocaleString("fr-FR")} XAF
                </span>
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: "var(--surface-2)", color: "#64748b" }}>
              {transactions.length} entrées
            </span>
          </div>

          <div>
            {loading ? (
              <div className="px-6 py-8 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl skeleton flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 skeleton rounded w-2/5" />
                      <div className="h-2.5 skeleton rounded w-1/4" />
                    </div>
                    <div className="h-3.5 skeleton rounded w-20" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Aucune transaction</p>
                <p className="text-slate-400 text-sm mt-1">Remplissez le formulaire pour ajouter une transaction.</p>
              </div>
            ) : (
              <div>
                {transactions.slice(0, 20).map((tx, idx) => {
                  const providerStr = tx.wallet?.provider ?? "OTHER";
                  const walletName  = tx.wallet?.name;
                  const logo  = getProviderLogo(providerStr, walletName);
                  const label = getProviderLabel(providerStr, walletName);

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50/60 transition-colors"
                      style={{ borderBottom: idx < Math.min(transactions.length, 20) - 1 ? "1px solid var(--surface-border)" : "none" }}
                    >
                      {/* Provider logo */}
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--surface-border)" }}>
                        <Image
                          src={logo}
                          alt={label}
                          width={36}
                          height={36}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {tx.description || "Transaction"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-slate-400">
                            {new Date(tx.occurredAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-400">
                            {new Date(tx.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ background: "var(--surface-2)", color: "#64748b" }}>
                            {label}
                          </span>
                          {tx.category && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ background: "var(--brand-50)", color: "var(--brand-600)" }}>
                                {tx.category.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <span className={`text-sm font-bold ${tx.type === "DEBIT" ? "text-red-500" : "text-emerald-500"}`}>
                          {tx.type === "DEBIT" ? "−" : "+"}
                          {Number(tx.amount).toLocaleString("fr-FR")}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">XAF</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
