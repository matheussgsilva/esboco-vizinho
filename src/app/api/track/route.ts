import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEventSchema } from "@/lib/validations/tracking";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = trackEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.businessEvent
    .create({ data: { businessId: parsed.data.businessId, type: parsed.data.type } })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
