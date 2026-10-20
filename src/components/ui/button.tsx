"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Direction B: pills, black labels, and a physical press. The resting offset
 * shadow collapses toward the baseline while held, so the button looks pushed
 * into the page. Every non-lime variant gets an equivalent non-lime offset.
 */
const buttonVariants = cva(
  "tap relative inline-flex items-center justify-center gap-2 rounded-btn font-black tracking-[-0.01em] select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg shadow-press-lime hover:bg-primary-strong active:translate-y-[4px] active:shadow-press-lime-sm",
        secondary:
          "border-2 border-border bg-surface text-fg shadow-press-ink hover:bg-surface-2 active:translate-y-[3px] active:shadow-press-ink-sm",
        soft: "bg-surface-2 text-fg hover:bg-surface-3",
        ink: "bg-fg text-bg shadow-press-ink hover:opacity-90 active:translate-y-[3px] active:shadow-press-ink-sm",
        ghost: "bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
        danger:
          "border-2 border-coral bg-coral-soft text-coral-fg shadow-press-coral hover:bg-coral-soft/70 active:translate-y-[3px] active:shadow-press-coral-sm",
      },
      size: {
        lg: "h-14 px-7 text-[16px]",
        md: "h-12 px-5 text-[15px]",
        sm: "h-11 px-4 text-[14px]",
        icon: "h-11 w-11 p-0",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, loading, leadingIcon, trailingIcon, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});

export { buttonVariants };
