import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ROLE_PREFIXES: Record<string, "ADMIN" | "BUSINESS" | "USER"> = {
  "/admin": "ADMIN",
  "/painel": "BUSINESS",
  "/minha-conta": "USER",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const requiredRole = Object.entries(ROLE_PREFIXES).find(([prefix]) =>
    pathname.startsWith(prefix)
  )?.[1];

  if (!requiredRole) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.user.role !== requiredRole && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/nao-autorizado", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
