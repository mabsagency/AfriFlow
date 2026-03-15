import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(url.searchParams.get("month") ?? new Date().getMonth() + 1);

  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
      year,
      month,
    },
    include: { category: true },
  });

  return NextResponse.json({ data: budgets });
}

export async function POST(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const { categoryId, year, month, amount } = await req.json();
  if (!year || !month || !amount) {
    return NextResponse.json({ error: "year, month, and amount are required." }, { status: 400 });
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_year_month_categoryId: {
        userId: user.id,
        year,
        month,
        categoryId: categoryId ?? null,
      },
    },
    update: { amount: Number(amount) as any },
    create: {
      userId: user.id,
      year,
      month,
      amount: Number(amount) as any,
      categoryId: categoryId ?? null,
    },
  });

  return NextResponse.json({ data: budget }, { status: 201 });
}
