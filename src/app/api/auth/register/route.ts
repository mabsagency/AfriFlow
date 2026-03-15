import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, createAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        name: name?.trim() || null,
      },
    });

    const token = signToken({ userId: user.id });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
    res.headers.set("Set-Cookie", createAuthCookie(token));
    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
