import type { ButtonHTMLAttributes } from "preact";
import { buttonVariants } from "./Button.css";

export type ButtonVariant = keyof typeof buttonVariants;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[buttonVariants[variant], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
