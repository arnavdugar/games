import { Link } from "wouter-preact";
import { PageLayout } from "./PageLayout";

import * as styles from "./LandingPage.css";

export function LandingPage() {
  return (
    <PageLayout title="Games">
      <ul className={styles.gameList}>
        <li>
          <Link
            aria-label="Play Imposter"
            className={styles.gameCard}
            href="/imposter"
          >
            <span aria-hidden="true" className={styles.gameIcon}>
              <span
                className={`material-symbols-outlined ${styles.gameIconGlyph}`}
              >
                mystery
              </span>
            </span>
            <span className={styles.gameDetails}>
              <span className={styles.gameName}>Imposter</span>
              <span className={styles.gameDescription}>
                Find the player who doesn&apos;t know the secret word.
              </span>
              <span className={styles.gameMeta}>
                <span
                  className={`material-symbols-outlined ${styles.metaIconGlyph}`}
                >
                  groups
                </span>
                3+ players
              </span>
            </span>
            <span aria-hidden="true" className={styles.playAction}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </Link>
        </li>
        <li>
          <Link
            aria-label="Play One Night Werewolf"
            className={styles.gameCard}
            href="/one-night-werewolf"
          >
            <span aria-hidden="true" className={styles.gameIcon}>
              <span
                className={`material-symbols-outlined ${styles.gameIconGlyph}`}
              >
                dark_mode
              </span>
            </span>
            <span className={styles.gameDetails}>
              <span className={styles.gameName}>One Night Werewolf</span>
              <span className={styles.gameDescription}>
                Move hidden roles overnight, then expose a werewolf by vote.
              </span>
              <span className={styles.gameMeta}>
                <span
                  className={`material-symbols-outlined ${styles.metaIconGlyph}`}
                >
                  groups
                </span>
                3–10 players
              </span>
            </span>
            <span aria-hidden="true" className={styles.playAction}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </Link>
        </li>
      </ul>
    </PageLayout>
  );
}
