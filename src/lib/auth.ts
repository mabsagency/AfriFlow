import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET ?? "CHANGE_ME_IN_PRODUCTION";
const JWT_EXPIRATION = "7d";
const COOKIE_NAME = "afriflow_token";

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.substring(7);

  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match?.[1] ?? null;
}

export function createAuthCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`;
}

export function clearAuthCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`;
}
