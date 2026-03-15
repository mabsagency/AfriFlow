import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: categories });
}

export async function POST(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const { name, emoji } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name: name.trim(),
      emoji: emoji ?? null,
    },
  });

  return NextResponse.json({ data: category }, { status: 201 });
}
