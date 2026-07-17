import type { ComponentChildren } from "preact";

import * as styles from "./Chip.css";

export type ChipTone = keyof typeof styles.tone;

interface ChipProps {
  children: ComponentChildren;
  tone: ChipTone;
}

export function Chip({ children, tone }: ChipProps) {
  return <span className={styles.tone[tone]}>{children}</span>;
}
