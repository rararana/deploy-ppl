import { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "w-full rounded-xl py-3 text-xl font-semibold text-white bg-brand transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
