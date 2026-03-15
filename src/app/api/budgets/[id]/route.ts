import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const { id } = await params;

  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget || budget.userId !== user.id) {
    return NextResponse.json({ error: "Budget introuvable." }, { status: 404 });
  }

  await prisma.budget.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const { id } = await params;

  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget || budget.userId !== user.id) {
    return NextResponse.json({ error: "Budget introuvable." }, { status: 404 });
  }

  const { amount } = await req.json();
  if (!amount) {
    return NextResponse.json({ error: "Le montant est requis." }, { status: 400 });
  }

  const updated = await prisma.budget.update({
    where: { id },
    data: { amount: Number(amount) as any },
    include: { category: true },
  });

  return NextResponse.json({ data: updated });
}
