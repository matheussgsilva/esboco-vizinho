"use client";

import { forwardRef, MouseEvent, ReactNode, useEffect, useImperativeHandle, useRef } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  { title, onClose, children },
  forwardedRef
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(forwardedRef, () => dialogRef.current as HTMLDialogElement);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-surface p-0 shadow-lg backdrop:bg-ink/40"
    >
      <div className="max-h-[85vh] overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => dialogRef.current?.close()}
            className="text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
});
