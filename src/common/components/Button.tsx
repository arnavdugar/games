import type { ButtonHTMLAttributes } from "preact";
import { buttonVariants } from "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
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
