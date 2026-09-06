"use client";

import { useState } from "react";

interface StarRatingInputProps {
  name?: string;
  defaultValue?: number;
}

export function StarRatingInput({ name = "rating", defaultValue = 0 }: StarRatingInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setValue(star)}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className="text-2xl leading-none text-rating transition-transform hover:scale-110"
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
