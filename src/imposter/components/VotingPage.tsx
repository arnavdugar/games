import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { SKIP_VOTE, useGame } from "../hooks/useGame";
import { ClueHistory } from "./ClueHistory";

import * as styles from "./VotingPage.css";

export function VotingPage() {
  const game = useGame();
  const player = game.currentVotePlayer;
  if (!player) return null;

  return (
    <>
      <GameStep
        actions={[
          {
            disabled: game.pendingVote === null,
            label: "Vote",
            onClick: game.submitVote,
          },
        ]}
        title={`${player.name}, choose a suspect`}
      >
        <div className={styles.options}>
          {game.votingPlayerIndexes.map((candidateIndex) => {
            const candidate = game.players[candidateIndex];
            const isSelf = candidateIndex === game.currentVotePlayerIndex;
            return (
              <label
                className={`${styles.option} ${
                  game.pendingVote === candidateIndex ? styles.selected : ""
                } ${isSelf ? styles.disabled : ""}`}
                key={candidateIndex}
              >
                <input
                  checked={game.pendingVote === candidateIndex}
                  className={styles.hiddenRadio}
                  disabled={isSelf}
                  name="vote"
                  onChange={() => game.setPendingVote(candidateIndex)}
                  type="radio"
                />
                <ClueHistory
                  clues={game.clues[candidateIndex] ?? []}
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
                onChange={() => game.setPendingVote(SKIP_VOTE)}
                type="radio"
              />
              <span className={styles.skipTitle}>Skip</span>
              <small className={styles.skipDescription}>
                Abstain this round
              </small>
            </label>
          ) : null}
        </div>
      </GameStep>
      <Progress
        completed={game.voteIndex}
        phase="voting"
        roundNumber={game.roundNumber}
        total={game.votingPlayerIndexes.length}
      />
    </>
  );
}
