import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, createAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signToken({ userId: user.id });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  res.headers.set("Set-Cookie", createAuthCookie(token));
  return res;
}
