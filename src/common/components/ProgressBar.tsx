import * as styles from "./ProgressBar.css";

interface ProgressBarProps {
  ariaLabel: string;
  tone?: keyof typeof styles.fill;
  total: number;
  value: number;
}

export function ProgressBar({
  ariaLabel,
  tone = "brand",
  total,
  value,
}: ProgressBarProps) {
  const maximum = Math.max(0, total);
  const current = Math.min(Math.max(0, value), maximum);
  const percentage = maximum === 0 ? 0 : (current / maximum) * 100;

  return (
    <div
      aria-label={ariaLabel}
      aria-valuemax={maximum}
      aria-valuemin={0}
      aria-valuenow={current}
      className={styles.track}
      role="progressbar"
    >
      <div className={styles.fill[tone]} style={{ width: `${percentage}%` }} />
    </div>
  );
}
