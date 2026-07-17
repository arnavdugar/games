import type { ComponentChildren } from "preact";
import { ProgressBar } from "./ProgressBar";

import * as styles from "./PlayerCard.css";

interface PlayerCardProps {
  children?: ComponentChildren;
  chip?: ComponentChildren;
  eliminated?: boolean;
  name: string;
  status?: ComponentChildren;
  voteCount?: number;
  voteTotal?: number;
  voters?: string[];
}

export function PlayerCard({
  children,
  chip,
  eliminated = false,
  name,
  status,
  voteCount,
  voteTotal,
  voters,
}: PlayerCardProps) {
  const variant = eliminated ? "eliminated" : "default";
  const hasVoteDetails =
    voteCount !== undefined && voteTotal !== undefined && voters !== undefined;

  return (
    <li className={styles.card[variant]}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <strong className={styles.title}>{name}</strong>
          {status != null ? (
            <small className={styles.status}>{status}</small>
          ) : null}
        </div>
        {chip}
      </div>
      {children}
      {hasVoteDetails ? (
        <div className={styles.voteDetails}>
          <div className={styles.voteHeader}>
            <strong>Votes received</strong>
            <span className={styles.voteCount}>
              {voteCount} / {voteTotal}
            </span>
          </div>
          <ProgressBar
            ariaLabel={`${name} received ${voteCount} of ${voteTotal} votes`}
            tone={eliminated ? "danger" : "brand"}
            total={voteTotal}
            value={voteCount}
          />
          <small className={styles.voterNames}>
            {voters.length > 0 ? `Voted by ${voters.join(", ")}` : "No votes"}
          </small>
        </div>
      ) : null}
    </li>
  );
}
