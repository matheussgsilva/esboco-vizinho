import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { planByPriceId } from "@/lib/plans";

export const runtime = "nodejs";

async function alreadyProcessed(eventId: string) {
  const existing = await prisma.processedWebhookEvent.findUnique({
    where: { id: eventId },
  });
  return existing !== null;
}

async function markProcessed(eventId: string) {
  await prisma.processedWebhookEvent.create({ data: { id: eventId } });
}

async function upsertSubscriptionFromStripe(
  stripeSubscription: Stripe.Subscription
) {
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const planType = priceId ? planByPriceId(priceId) : null;

  const subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: stripeSubscription.customer as string },
  });
  if (!subscription) return;

  const status = stripeSubscription.status.toUpperCase() as
    | "TRIALING"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELED"
    | "UNPAID"
    | "INCOMPLETE"
    | "INCOMPLETE_EXPIRED"
    | "PAUSED";

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId,
        planType: planType ?? subscription.planType,
        status,
        currentPeriodEnd: stripeSubscription.items.data[0]?.current_period_end
          ? new Date(stripeSubscription.items.data[0].current_period_end * 1000)
          : null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
    }),
    prisma.business.update({
      where: { id: subscription.businessId },
      data: { planType: planType ?? subscription.planType },
    }),
  ]);
}

async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription
) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: stripeSubscription.customer as string },
  });
  if (!subscription) return;

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELED", planType: "FREE" },
    }),
    prisma.business.update({
      where: { id: subscription.businessId },
      data: { planType: "FREE" },
    }),
  ]);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  if (await alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, deduped: true });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid" || !session.subscription) break;

      const stripeSubscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      await upsertSubscriptionFromStripe(stripeSubscription);
      break;
    }

    case "customer.subscription.updated": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      await upsertSubscriptionFromStripe(stripeSubscription);
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(stripeSubscription);
      break;
    }

    case "invoice.paid":
    case "invoice.payment_failed":
      // TODO(próxima iteração): atualizar status/currentPeriodEnd a partir da invoice
      // e disparar os emails de confirmação/falha de pagamento via Resend.
      break;

    default:
      break;
  }

  await markProcessed(event.id);
  return NextResponse.json({ received: true });
}
