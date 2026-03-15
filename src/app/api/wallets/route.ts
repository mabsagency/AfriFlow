import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: wallets });
}

/**
 * PATCH /api/wallets — Rename "Primary wallet" → correct provider names.
 * Called once on first load to migrate old default wallets.
 */
export async function PATCH(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  // Rename the old catch-all wallet
  await prisma.wallet.updateMany({
    where: { userId: user.id, name: "Primary wallet" },
    data: { name: "Autres" },
  });

  return NextResponse.json({ ok: true });
}
