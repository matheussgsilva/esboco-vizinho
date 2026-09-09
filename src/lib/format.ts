const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatSalary(job: { salaryMin: number | null; salaryMax: number | null }) {
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)}`;
  }
  if (job.salaryMin != null) return `A partir de ${currencyFormatter.format(job.salaryMin)}`;
  if (job.salaryMax != null) return `Até ${currencyFormatter.format(job.salaryMax)}`;
  return null;
}
