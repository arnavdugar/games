import { ProgressBar } from "./ProgressBar";

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
  const count = `${safeCompleted} of ${safeTotal} complete`;
  const detail = roundNumber ? `Round ${roundNumber} · ${count}` : count;

  return (
    <div className={styles.progress} aria-label={`${phase} progress`}>
      <div className={styles.row}>
        <span className={styles.phaseLabel}>{phase}</span>
        <span className={styles.detail}>{detail}</span>
      </div>
      <ProgressBar
        ariaLabel={`${phase} complete`}
        total={safeTotal}
        value={safeCompleted}
      />
    </div>
  );
}
