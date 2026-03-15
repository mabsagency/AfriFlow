import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || typeof payload === "string" || !("userId" in payload)) return null;

  return prisma.user.findUnique({ where: { id: (payload as any).userId } });
}

export async function requireCurrentUser(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}
