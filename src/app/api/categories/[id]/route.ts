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

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || category.userId !== user.id) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }

  // Dissociate transactions before deleting
  await prisma.transaction.updateMany({
    where: { categoryId: id, userId: user.id },
    data: { categoryId: null },
  });

  await prisma.category.delete({ where: { id } });
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

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || category.userId !== user.id) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }

  const { name, emoji } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: name.trim(),
      ...(emoji !== undefined && { emoji: emoji || null }),
    },
  });

  return NextResponse.json({ data: updated });
}
