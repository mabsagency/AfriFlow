import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export async function GET(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1);

  const [allTxs, recentTxs, topCatGroups, transactionCount] = await Promise.all([
    // All transactions ever (to compute total balance)
    prisma.transaction.findMany({
      where: { userId: user.id },
      select: { amount: true, type: true },
    }),
    // Last 8 months (for area chart + this-month stats)
    prisma.transaction.findMany({
      where: { userId: user.id, occurredAt: { gte: eightMonthsAgo } },
      select: { amount: true, type: true, occurredAt: true },
    }),
    // Top expense categories this month
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId: user.id, type: "DEBIT", occurredAt: { gte: startOfMonth } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    }),
    // Transaction count this month
    prisma.transaction.count({
      where: { userId: user.id, occurredAt: { gte: startOfMonth } },
    }),
  ]);

  // ── Total balance = all CREDITs − all DEBITs ───────────────────────────
  const balance = allTxs.reduce((sum, tx) => {
    return sum + (tx.type === "CREDIT" ? Number(tx.amount) : -Number(tx.amount));
  }, 0);

  // ── Monthly aggregation ────────────────────────────────────────────────
  let monthlySpending = 0;
  let monthlyIncome = 0;
  const monthlyMap: Record<string, { depenses: number; revenus: number }> = {};

  for (const tx of recentTxs) {
    const d = new Date(tx.occurredAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthlyMap[key]) monthlyMap[key] = { depenses: 0, revenus: 0 };
    const amt = Number(tx.amount);

    if (tx.type === "DEBIT") monthlyMap[key].depenses += amt;
    else monthlyMap[key].revenus += amt;

    // This month's totals
    if (d >= startOfMonth) {
      if (tx.type === "DEBIT") monthlySpending += amt;
      else monthlyIncome += amt;
    }
  }

  const savingsRate =
    monthlyIncome > 0
      ? Math.max(0, Math.round(((monthlyIncome - monthlySpending) / monthlyIncome) * 100))
      : 0;

  // ── 8-month area chart data ────────────────────────────────────────────
  const areaData = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    areaData.push({
      month: MONTH_LABELS[d.getMonth()],
      depenses: Math.round(monthlyMap[key]?.depenses ?? 0),
      revenus: Math.round(monthlyMap[key]?.revenus ?? 0),
    });
  }

  // ── Category names ─────────────────────────────────────────────────────
  const categoryIds = topCatGroups
    .filter((c) => c.categoryId)
    .map((c) => c.categoryId as string);

  const categoryRecords =
    categoryIds.length > 0
      ? await prisma.category.findMany({ where: { id: { in: categoryIds } } })
      : [];

  const catMap = Object.fromEntries(categoryRecords.map((c) => [c.id, c.name]));

  const topCategories = topCatGroups.map((c) => ({
    categoryId: c.categoryId,
    name: c.categoryId ? (catMap[c.categoryId] ?? "Inconnu") : "Non catégorisé",
    amount: Number(c._sum.amount ?? 0),
  }));

  return NextResponse.json({
    balance,
    monthlySpending,
    monthlyIncome,
    savingsRate,
    transactionCount,
    topCategories,
    areaData,
  });
}
