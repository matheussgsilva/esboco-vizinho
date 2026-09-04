interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1 text-sm">
      <span aria-hidden className="text-rating">
        {"★".repeat(Math.floor(rounded))}
        {rounded % 1 !== 0 ? "½" : ""}
      </span>
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-ink-muted">({reviewCount})</span>
      )}
    </div>
  );
}
