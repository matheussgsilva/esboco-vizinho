"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession, requireBusinessOwner } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import {
  jobCreateSchema,
  jobUpdateSchema,
  jobDeleteSchema,
  JOB_DEFAULT_DURATION_DAYS,
} from "@/lib/validations/job";

export interface JobState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function fieldErrorsFromZod(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function defaultClosesAt() {
  return new Date(Date.now() + JOB_DEFAULT_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

export async function jobAction(_prevState: JobState, formData: FormData): Promise<JobState> {
  const session = await requireSession();
  const intent = formData.get("intent");

  if (intent === "create") {
    const business = await getOwnedBusiness(session.user.id);
    if (!business) {
      return { error: "Empresa não encontrada." };
    }
    await requireBusinessOwner(business.ownerId);

    const parsed = jobCreateSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      workMode: formData.get("workMode"),
      city: formData.get("city"),
      state: formData.get("state"),
      salaryMin: formData.get("salaryMin"),
      salaryMax: formData.get("salaryMax"),
      showSalary: formData.get("showSalary"),
      contactEmail: formData.get("contactEmail"),
      applicationUrl: formData.get("applicationUrl"),
      closesAt: formData.get("closesAt"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const { closesAt, ...data } = parsed.data;

    await prisma.job.create({
      data: { businessId: business.id, ...data, closesAt: closesAt ?? defaultClosesAt() },
    });

    revalidatePath("/painel/vagas");
    revalidatePath("/vagas");
    revalidatePath(`/empresas/${business.slug}`);
    return {};
  }

  if (intent === "update") {
    const parsed = jobUpdateSchema.safeParse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      workMode: formData.get("workMode"),
      city: formData.get("city"),
      state: formData.get("state"),
      salaryMin: formData.get("salaryMin"),
      salaryMax: formData.get("salaryMax"),
      showSalary: formData.get("showSalary"),
      contactEmail: formData.get("contactEmail"),
      applicationUrl: formData.get("applicationUrl"),
      status: formData.get("status"),
      closesAt: formData.get("closesAt"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const { id, ...data } = parsed.data;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { business: { select: { ownerId: true, slug: true } } },
    });

    if (!job) {
      return { error: "Vaga não encontrada." };
    }

    await requireBusinessOwner(job.business.ownerId);

    await prisma.job.update({ where: { id }, data });

    revalidatePath("/painel/vagas");
    revalidatePath("/vagas");
    revalidatePath(`/vagas/${id}`);
    revalidatePath(`/empresas/${job.business.slug}`);
    return {};
  }

  if (intent === "delete") {
    const parsed = jobDeleteSchema.safeParse({ id: formData.get("id") });
    if (!parsed.success) {
      return { error: "Ação inválida." };
    }

    const job = await prisma.job.findUnique({
      where: { id: parsed.data.id },
      include: { business: { select: { ownerId: true, slug: true } } },
    });

    if (!job) {
      return { error: "Vaga não encontrada." };
    }

    await requireBusinessOwner(job.business.ownerId);

    await prisma.job.delete({ where: { id: job.id } });

    revalidatePath("/painel/vagas");
    revalidatePath("/vagas");
    revalidatePath(`/empresas/${job.business.slug}`);
    return {};
  }

  return { error: "Ação inválida." };
}
