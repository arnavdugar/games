import { Button } from "../../common/components/Button";
import {
  actionStack,
  mutedText,
  page,
  pageTitle,
  panel,
  panelStack,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";
import { ClueHistory } from "./ClueHistory";

import * as styles from "./DiscussionPage.css";

export function DiscussionPage() {
  const game = useGame();

  return (
    <section className={page} aria-labelledby="discussion-title">
      <div className={`${panelStack} ${panel}`}>
        <h2 className={pageTitle} id="discussion-title">
          Discuss the clues
        </h2>
        <p className={mutedText}>
          Compare wording, timing, and repeated ideas before anyone votes.
        </p>
        <div className={styles.playerList}>
          {game.activePlayers.map((player) => (
            <article className={styles.playerCard} key={player.id}>
              <ClueHistory
                clues={game.clues[player.id] ?? []}
                name={player.name}
              />
            </article>
          ))}
        </div>
        <div className={actionStack}>
          <Button onClick={game.startVoting} type="button">
            Start hidden voting
          </Button>
          <Button onClick={game.continueGame} type="button" variant="secondary">
            Take another clue round
          </Button>
        </div>
      </div>
    </section>
  );
}
