import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

const VALID_PROVIDERS = ["MTN_MONEY", "ORANGE_MONEY", "PAYSIKA", "NEERO", "OTHER"] as const;
type ValidProvider = typeof VALID_PROVIDERS[number];

function getWalletName(provider: string, rawKey?: string): string {
  if (rawKey === "DEPENSES") return "Autres dépenses";
  switch (provider) {
    case "MTN_MONEY":    return "MTN Money";
    case "ORANGE_MONEY": return "Orange Money";
    case "PAYSIKA":      return "Paysika";
    case "NEERO":        return "Neero";
    case "OTHER":        return "Chariow";
    default:             return "Autres";
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const categoryId = url.searchParams.get("categoryId");
  const walletId = url.searchParams.get("walletId");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");

  const where: any = { userId: user.id };
  if (q) {
    where.OR = [
      { description: { contains: q, mode: "insensitive" } },
      { providerTransactionId: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (walletId) where.walletId = walletId;
  if (startDate || endDate) {
    where.occurredAt = {};
    if (startDate) where.occurredAt.gte = new Date(startDate);
    if (endDate) where.occurredAt.lte = new Date(endDate + "T23:59:59");
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { occurredAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: { category: true, wallet: true },
  });

  return NextResponse.json({ data: transactions });
}

export async function POST(req: NextRequest) {
  const authResult = await requireCurrentUser(req);
  if (authResult instanceof Response) return authResult;
  const user = authResult;

  const body = await req.json();
  const {
    amount, currency, type, categoryId, description,
    occurredAt, walletId, providerTransactionId, provider,
  } = body ?? {};

  if (!amount || !type) {
    return NextResponse.json({ error: "amount and type are required." }, { status: 400 });
  }

  // Normalize provider key to a valid Prisma enum value
  const normalizedProvider: ValidProvider = VALID_PROVIDERS.includes(provider as ValidProvider)
    ? (provider as ValidProvider)
    : "OTHER";

  // Wallet name distinguishes Chariow (OTHER) from Autres dépenses (DEPENSES → OTHER)
  const walletName = getWalletName(normalizedProvider, provider);

  let walletIdToUse = walletId;
  if (!walletIdToUse) {
    // Find or create a dedicated wallet per user+provider+name combination
    const existingWallet = await prisma.wallet.findFirst({
      where: { userId: user.id, provider: normalizedProvider, name: walletName },
    });

    if (existingWallet) {
      walletIdToUse = existingWallet.id;
    } else {
      const externalId = `${normalizedProvider}-${walletName}-${user.id}`.substring(0, 50);
      const created = await prisma.wallet.create({
        data: {
          userId: user.id,
          provider: normalizedProvider,
          externalId,
          name: walletName,
        },
      });
      walletIdToUse = created.id;
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      walletId: walletIdToUse,
      amount: Number(amount) as any,
      currency: currency ?? "XAF",
      type,
      categoryId: categoryId || undefined,
      description,
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      providerTransactionId,
      importedAt: new Date(),
    },
    include: { category: true, wallet: true },
  });

  return NextResponse.json({ data: transaction }, { status: 201 });
}
