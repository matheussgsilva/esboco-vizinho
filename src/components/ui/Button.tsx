import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-coral text-white hover:bg-brand-coral-dark",
  secondary:
    "bg-brand-teal text-white hover:bg-brand-teal/90",
  ghost:
    "bg-transparent text-ink border border-border hover:bg-surface-blush/40",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
);

Button.displayName = "Button";
