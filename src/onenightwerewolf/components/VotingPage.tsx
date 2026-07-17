import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { useGame } from "../hooks/useGame";

import * as styles from "./VotingPage.css";

export function VotingPage() {
  const game = useGame();
  if (game.state.phase !== "voting") return null;

  const { voting } = game;
  const state = game.state.voting;
  const player = voting.players[state.voterIndex];
  if (!player) return null;

  const gameStep = (() => {
    switch (state.step) {
      case "handoff":
        return (
          <GameStep
            actions={[
              {
                label: "Choose my vote",
                onClick: voting.revealVote,
              },
            ]}
            description="Each player votes privately. Do not show your choice to anyone else."
            title={`Pass to ${player.name}`}
          />
        );
      case "choosing":
        return (
          <GameStep
            actions={[
              {
                disabled: state.pendingVote === null,
                label: "Vote",
                onClick: voting.submitVote,
              },
            ]}
            description="Pick one other player. Two or more votes are needed for an elimination; everyone tied for the most votes is eliminated."
            title={`${player.name}, choose a suspect`}
          >
            <div className={styles.options}>
              {voting.players.map((candidate, candidateIndex) => {
                const isSelf = candidateIndex === state.voterIndex;
                return (
                  <label
                    className={`${styles.option} ${
                      state.pendingVote === candidateIndex
                        ? styles.selected
                        : ""
                    } ${isSelf ? styles.disabled : ""}`}
                    key={candidateIndex}
                  >
                    <input
                      checked={state.pendingVote === candidateIndex}
                      className={styles.hiddenRadio}
                      disabled={isSelf}
                      name="vote"
                      onChange={() => voting.selectVote(candidateIndex)}
                      type="radio"
                    />
                    <span className={styles.optionName}>{candidate.name}</span>
                  </label>
                );
              })}
            </div>
          </GameStep>
        );
    }
  })();

  return (
    <>
      {gameStep}
      <Progress
        completed={state.voterIndex}
        phase="voting"
        total={voting.players.length}
      />
    </>
  );
}
