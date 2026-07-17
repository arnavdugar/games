import { Button } from "../../common/components/Button";
import { Progress } from "../../common/components/Progress";
import {
  mutedText,
  page,
  pageTitle,
  panel,
  panelStack,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";

import * as styles from "./VotingPage.css";

export function VotingPage() {
  const game = useGame();
  const player = game.currentVotePlayer;
  if (!player) return null;

  if (!game.voteVisible) {
    return (
      <section className={page} aria-labelledby="vote-pass-title">
        <div className={`${panelStack} ${panel}`}>
          <h2 className={pageTitle} id="vote-pass-title">
            Pass to {player.name}
          </h2>
          <p className={mutedText}>
            Each player votes privately. Do not show your choice to anyone else.
          </p>
          <Button onClick={() => game.setVoteVisible(true)} type="button">
            Choose my vote
          </Button>
        </div>
        <Progress
          completed={game.voteIndex}
          phase="voting"
          total={game.players.length}
        />
      </section>
    );
  }

  return (
    <section className={page} aria-labelledby="vote-title">
      <div className={`${panelStack} ${panel}`}>
        <h2 className={pageTitle} id="vote-title">
          {player.name}, choose a suspect
        </h2>
        <p className={mutedText}>
          Pick one other player. Two or more votes are needed for an
          elimination; everyone tied for the most votes is eliminated.
        </p>
        <div className={styles.options}>
          {game.players.map((candidate) => {
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
                <span className={styles.optionName}>{candidate.name}</span>
              </label>
            );
          })}
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
        total={game.players.length}
      />
    </section>
  );
}
