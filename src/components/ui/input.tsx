import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-input border-2 bg-surface px-4 text-[15px] font-bold text-fg placeholder:font-normal placeholder:text-fg-subtle transition-[box-shadow,border-color] duration-200 focus:border-fg focus:outline-none disabled:opacity-50";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, optional, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-2">
          <label className="text-label font-black tracking-[-0.01em] text-fg">{label}</label>
          {optional ? <span className="text-caption text-fg-subtle">可跳过</span> : null}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className="text-caption text-coral-fg">{error}</p>
      ) : hint ? (
        <p className="text-caption text-fg-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  invalid,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; suffix?: ReactNode }) {
  return (
    <div className="relative">
      <input
        className={cn(
          fieldBase,
          "h-14 tabular-nums",
          invalid ? "border-coral" : "border-border",
          suffix ? "pr-16" : "",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-caption text-fg-muted">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "border-border min-h-28 resize-none py-3 leading-relaxed", className)}
      {...props}
    />
  );
}
