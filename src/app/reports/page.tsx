"use client";

import { useEffect, useState } from "react";
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

const getProviderLogo = (provider?: string, walletName?: string): string => {
  switch (provider) {
    case "MTN_MONEY":    return "/mtn.jpg";
    case "ORANGE_MONEY": return "/Orange.png";
    case "PAYSIKA":      return "/paysika.jpg";
    case "NEERO":        return "/neero.jpg";
    case "OTHER":
      if (walletName === "Autres dépenses" || walletName === "Autres") return "/depenses.jpg";
      if (walletName === "Chariow") return "/chariow.png";
      return "/depenses.jpg";
    default:             return "/depenses.jpg";
  }
};

const getProviderLabel = (provider?: string, walletName?: string): string => {
  if (walletName && walletName !== "Primary wallet" && walletName !== "Autres") return walletName;
  switch (provider) {
    case "MTN_MONEY":    return "MTN Money";
    case "ORANGE_MONEY": return "Orange Money";
    case "PAYSIKA":      return "Paysika";
    case "NEERO":        return "Neero";
    default:             return "Autre";
  }
};

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { fetchTransactions(); }, [dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ startDate: dateRange.start, endDate: dateRange.end });
      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) throw new Error("Échec du chargement");
      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Provenance", "Catégorie", "Montant", "Type"];
    const csvData = transactions.map(tx => [
      new Date(tx.occurredAt).toLocaleDateString("fr-FR"),
      tx.description || "",
      getProviderLabel(tx.wallet?.provider, tx.wallet?.name),
      tx.category?.name || "Non catégorisé",
      Number(tx.amount),
      tx.type === "CREDIT" ? "Revenu" : "Dépense",
    ]);
    const csvContent = [headers, ...csvData].map(row => row.map(f => `"${f}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${dateRange.start}-au-${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalIncome = transactions.filter(tx => tx.type === "CREDIT").reduce((s, tx) => s + Number(tx.amount), 0);
  const totalExpenses = transactions.filter(tx => tx.type === "DEBIT").reduce((s, tx) => s + Number(tx.amount), 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="page-content animate-fade-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Rapports Financiers</h1>
          <p className="page-subtitle">Analysez vos habitudes de dépenses et exportez des rapports détaillés.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={transactions.length === 0}
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Exporter CSV</span>
        </button>
      </div>

      {/* Date Filter */}
      <div className="p-6 rounded-2xl mb-8" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Période du rapport</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Date de début</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Date de fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div className="p-4 sm:p-6 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Revenus totaux</p>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{totalIncome.toLocaleString("fr-FR")}</p>
          <p className="text-white/60 text-sm mt-1">XAF</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Dépenses totales</p>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{totalExpenses.toLocaleString("fr-FR")}</p>
          <p className="text-white/60 text-sm mt-1">XAF</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Revenu net</p>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${netIncome >= 0 ? "text-green-200" : "text-red-200"}`}>
            {netIncome >= 0 ? "+" : ""}{netIncome.toLocaleString("fr-FR")}
          </p>
          <p className="text-white/60 text-sm mt-1">XAF</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5" style={{ borderBottom: "1px solid var(--surface-border)" }}>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Détail des Transactions</h2>
            <p className="text-xs text-slate-400 mt-0.5">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""} trouvée{transactions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Chargement des transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">Aucune transaction trouvée</h3>
              <p className="text-slate-500 text-sm">Ajustez la période ou ajoutez des transactions.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--surface-border)" }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Provenance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors" style={{ borderBottom: idx < transactions.length - 1 ? "1px solid var(--surface-border)" : "none" }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-700 font-medium">
                        {new Date(tx.occurredAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(tx.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                      {tx.description || "Sans description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--surface-border)" }}>
                          <Image
                            src={getProviderLogo(tx.wallet?.provider, tx.wallet?.name)}
                            alt={getProviderLabel(tx.wallet?.provider, tx.wallet?.name)}
                            width={28}
                            height={28}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {getProviderLabel(tx.wallet?.provider, tx.wallet?.name)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {tx.category?.name ? (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: "var(--brand-50)", color: "var(--brand-700)" }}>
                          {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">Non catégorisé</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${tx.type === "DEBIT" ? "text-red-600" : "text-green-600"}`}>
                        {tx.type === "DEBIT" ? "-" : "+"}{Number(tx.amount).toLocaleString("fr-FR")} XAF
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${tx.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {tx.type === "CREDIT" ? "Revenu" : "Dépense"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
