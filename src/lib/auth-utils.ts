import "server-only";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "../../generated/enums";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    unauthorized();
  }
  return session;
}

export async function requireRole(allowed: Role[]) {
  const session = await requireSession();
  if (!allowed.includes(session.user.role)) {
    forbidden();
  }
  return session;
}

export async function requireBusinessOwner(businessOwnerId: string) {
  const session = await requireSession();
  if (session.user.role === "ADMIN") return session;
  if (session.user.id !== businessOwnerId) {
    forbidden();
  }
  return session;
}
