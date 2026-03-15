import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, amount } = await req.json();

  // Placeholder classification logic.
  // Replace with a proper ML/AI backend integration.
  const category = description?.toLowerCase().includes("coffee")
    ? "Food & Drink"
    : description?.toLowerCase().includes("uber")
    ? "Transport"
    : "Uncategorized";

  return NextResponse.json({ category });
}
