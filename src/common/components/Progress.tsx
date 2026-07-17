import * as styles from "./Progress.css";

interface ProgressProps {
  completed: number;
  phase: string;
  roundNumber?: number;
  total: number;
}

export function Progress({
  completed,
  phase,
  roundNumber,
  total,
}: ProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCompleted = Math.min(Math.max(0, completed), safeTotal);
  const percentage = (safeCompleted / safeTotal) * 100;
  const count = `${safeCompleted} of ${safeTotal} complete`;
  const detail = roundNumber ? `Round ${roundNumber} · ${count}` : count;

  return (
    <div className={styles.progress} aria-label={`${phase} progress`}>
      <div className={styles.row}>
        <span className={styles.phaseLabel}>{phase}</span>
        <span className={styles.detail}>{detail}</span>
      </div>
      <div
        aria-label={`${phase} complete`}
        aria-valuemax={safeTotal}
        aria-valuemin={0}
        aria-valuenow={safeCompleted}
        className={styles.track}
        role="progressbar"
      >
        <div className={styles.fill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
