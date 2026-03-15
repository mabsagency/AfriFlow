import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";

export async function GET(req: Request) {
  const authResult = await getCurrentUser(req as any);
  if (!authResult) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = authResult;
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
