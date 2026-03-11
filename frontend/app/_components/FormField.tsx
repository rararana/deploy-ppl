import { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ className, ...props }: FormFieldProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl px-5 py-3 text-lg text-ink bg-field-bg border-2 border-field-border placeholder:text-ink/65 outline-none focus:ring-2 focus:ring-brand",
        className
      )}
    />
  );
}
