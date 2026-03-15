import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "afriflow_token";

const PUBLIC_PATHS = ["/", "/login", "/register"];
const PUBLIC_API_PREFIXES = ["/api/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|gif|webp|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Redirect authenticated users away from login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!token && !isPublicPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
