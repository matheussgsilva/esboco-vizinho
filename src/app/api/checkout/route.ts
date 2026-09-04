import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";
import { requireSession } from "@/lib/auth-utils";
import type { PlanType } from "../../../../generated/enums";

function randomLetterSuffix(length = 8) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const session = await requireSession();

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { subscription: true },
  });
  if (!business) {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }

  const { planType } = (await request.json()) as { planType: PlanType };
  const plan = PLANS[planType];
  if (!plan || !plan.stripePriceId) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  let stripeCustomerId = business.subscription?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: business.email ?? session.user.email ?? undefined,
      name: business.name,
      metadata: { businessId: business.id },
    });
    stripeCustomerId = customer.id;

    await prisma.subscription.upsert({
      where: { businessId: business.id },
      create: { businessId: business.id, stripeCustomerId },
      update: { stripeCustomerId },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${appUrl}/painel/assinatura?status=sucesso`,
    cancel_url: `${appUrl}/painel/assinatura?status=cancelado`,
    integration_identifier: `paginasamarelas${randomLetterSuffix()}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
