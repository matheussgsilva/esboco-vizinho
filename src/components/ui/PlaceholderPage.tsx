export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center gap-3 px-4 py-24">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="text-ink-muted">{description}</p>
    </main>
  );
}
