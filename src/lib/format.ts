const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatSalary(job: { salaryMin: number | null; salaryMax: number | null }) {
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)}`;
  }
  if (job.salaryMin != null) return `A partir de ${currencyFormatter.format(job.salaryMin)}`;
  if (job.salaryMax != null) return `Até ${currencyFormatter.format(job.salaryMax)}`;
  return null;
}

export function toWhatsappHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  // Business.whatsapp é texto livre sem máscara/validação — número sem código do
  // país (DDD + número, 10-11 dígitos) recebe o prefixo 55 (Brasil) para o wa.me.
  const withCountryCode = digits.startsWith("55") || digits.length > 11 ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}`;
}
