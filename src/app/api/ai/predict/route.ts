import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { transactions } = await req.json();

  // Placeholder prediction logic.
  // Replace with real AI/model inference to provide more accurate forecasts.
  const average = Array.isArray(transactions) && transactions.length
    ? transactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0) / transactions.length
    : 0;

  const prediction = {
    monthlySpend: average * 30,
    suggestedSavings: Math.max(0, average * 30 * 0.1),
  };

  return NextResponse.json({ prediction });
}
