"use client";

import { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";

interface ConfirmSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmText: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function ConfirmSubmitButton({
  confirmText,
  onClick,
  ...props
}: ConfirmSubmitButtonProps) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    />
  );
}
