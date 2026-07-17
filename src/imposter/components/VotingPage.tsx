import { Button } from "../../common/components/Button";
import { Progress } from "../../common/components/Progress";
import { page, pageTitle, panel, panelStack } from "../../styles.css";
import { SKIP_VOTE, useGame } from "../hooks/useGame";
import { ClueHistory } from "./ClueHistory";

import * as styles from "./VotingPage.css";

export function VotingPage() {
  const game = useGame();
  const player = game.currentVotePlayer;
  if (!player) return null;

  return (
    <section className={page} aria-labelledby="vote-title">
      <div className={`${panelStack} ${panel}`}>
        <h2 className={pageTitle} id="vote-title">
          {player.name}, choose a suspect
        </h2>
        <div className={styles.options}>
          {game.votingPlayers.map((candidate) => {
            const isSelf = candidate.id === player.id;
            return (
              <label
                className={`${styles.option} ${
                  game.pendingVote === candidate.id ? styles.selected : ""
                } ${isSelf ? styles.disabled : ""}`}
                key={candidate.id}
              >
                <input
                  checked={game.pendingVote === candidate.id}
                  className={styles.hiddenRadio}
                  disabled={isSelf}
                  name="vote"
                  onChange={(event) =>
                    game.setPendingVote(event.currentTarget.value)
                  }
                  type="radio"
                  value={candidate.id}
                />
                <ClueHistory
                  clues={game.clues[candidate.id] ?? []}
                  name={candidate.name}
                />
              </label>
            );
          })}
          {game.allowAbstaining ? (
            <label
              className={`${styles.option} ${styles.skip} ${
                game.pendingVote === SKIP_VOTE ? styles.selected : ""
              }`}
            >
              <input
                checked={game.pendingVote === SKIP_VOTE}
                className={styles.hiddenRadio}
                name="vote"
                onChange={(event) =>
                  game.setPendingVote(event.currentTarget.value)
                }
                type="radio"
                value={SKIP_VOTE}
              />
              <span className={styles.skipTitle}>Skip</span>
              <small className={styles.skipDescription}>
                Abstain this round
              </small>
            </label>
          ) : null}
        </div>
        <Button
          disabled={!game.pendingVote}
          onClick={game.submitVote}
          type="button"
        >
          Vote
        </Button>
      </div>
      <Progress
        completed={game.voteIndex}
        phase="voting"
        roundNumber={game.roundNumber}
        total={game.votingPlayers.length}
      />
    </section>
  );
}
