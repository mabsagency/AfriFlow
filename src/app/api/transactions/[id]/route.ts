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

  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction || transaction.userId !== user.id) {
    return NextResponse.json({ error: "Transaction introuvable." }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });
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

  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction || transaction.userId !== user.id) {
    return NextResponse.json({ error: "Transaction introuvable." }, { status: 404 });
  }

  const { amount, description, categoryId, occurredAt, type } = await req.json();

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(amount !== undefined && { amount: Number(amount) as any }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(occurredAt !== undefined && { occurredAt: new Date(occurredAt) }),
      ...(type !== undefined && { type }),
    },
    include: { category: true, wallet: true },
  });

  return NextResponse.json({ data: updated });
}
