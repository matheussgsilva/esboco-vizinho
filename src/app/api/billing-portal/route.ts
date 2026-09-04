import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-utils";

export async function POST() {
  const stripe = getStripe();
  const session = await requireSession();

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { subscription: true },
  });

  if (!business?.subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Nenhuma assinatura encontrada para esta empresa" },
      { status: 404 }
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: business.subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/painel/assinatura`,
  });

  return NextResponse.json({ url: portalSession.url });
}
