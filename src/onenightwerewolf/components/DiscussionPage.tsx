import { Button } from "../../common/components/Button";
import {
  mutedText,
  page,
  pageTitle,
  panel,
  panelStack,
  warningMessage,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";

import * as styles from "./DiscussionPage.css";

export function DiscussionPage() {
  const game = useGame();
  return (
    <section className={page} aria-labelledby="day-title">
      <div className={`${panelStack} ${panel}`}>
        <span aria-hidden="true" className={styles.sunIcon}>
          <span className={`material-symbols-outlined ${styles.sunIconGlyph}`}>
            light_mode
          </span>
        </span>
        <h2 className={pageTitle} id="day-title">
          Day phase
        </h2>
        <p className={mutedText}>
          Start the narrator&apos;s day timer. Share information, bluff, and
          reconstruct how the roles moved during the night.
        </p>
        <div className={styles.playerCloud} aria-label="Players">
          {game.players.map((player) => (
            <span className={styles.playerChip} key={player.id}>
              {player.name}
            </span>
          ))}
        </div>
        <Button onClick={game.startVoting} type="button">
          Start hidden voting
        </Button>
      </div>
    </section>
  );
}
