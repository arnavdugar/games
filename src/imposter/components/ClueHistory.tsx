import { Fragment } from "preact";

import * as styles from "./ClueHistory.css";

interface ClueHistoryProps {
  clues: string[];
  name: string;
}

export function ClueHistory({ clues, name }: ClueHistoryProps) {
  return (
    <>
      <span className={styles.playerName}>
        <span aria-hidden="true" className="material-symbols-outlined">
          person
        </span>
        {name}
      </span>
      <span className={styles.clueGrid}>
        <span className={styles.roundHeader}>Round</span>
        <span className={styles.clueHeader}>Clue</span>
        {clues.map((clue, index) => (
          <Fragment key={index}>
            <span className={styles.roundNumber}>{index + 1}</span>
            <strong className={styles.clue}>{clue}</strong>
          </Fragment>
        ))}
      </span>
    </>
  );
}
