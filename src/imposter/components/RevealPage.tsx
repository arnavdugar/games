import { GameStep } from "../../common/components/GameStep";
import { PlayerCard } from "../../common/components/PlayerCard";
import { useGame } from "../hooks/useGame";
import type { VoteCount } from "../types";

import * as styles from "./RevealPage.css";

function VoteResult({
  activePlayerCount,
  eliminated,
  entry,
  role,
}: {
  activePlayerCount: number;
  eliminated: boolean;
  entry: VoteCount;
  role?: "Imposter" | "Civilian";
}) {
  return (
    <PlayerCard
      chip={
        role
          ? {
              label: role,
              tone: role === "Imposter" ? "danger" : "brand",
            }
          : undefined
      }
      eliminated={eliminated}
      name={entry.name}
      voteCount={entry.count}
      voteTotal={activePlayerCount}
      voters={entry.voters}
    />
  );
}

export function RevealPage() {
  const game = useGame();
  const result = game.roundResult;
  if (!result) return null;

  const activePlayerCount = result.voteCounts.length;
  const gameOver =
    result.winner === "civilians" || result.winner === "imposters";
  const eliminatedPlayer =
    result.eliminatedPlayerIndex === null
      ? null
      : game.players[result.eliminatedPlayerIndex];
  const visibleVoteCounts = gameOver
    ? [
        ...result.voteCounts,
        ...game.players
          .map((player, playerIndex) => ({ player, playerIndex }))
          .filter(
            ({ playerIndex }) =>
              !result.voteCounts.some(
                (entry) => entry.playerIndex === playerIndex,
              ),
          )
          .map(({ player, playerIndex }) => ({
            playerIndex,
            name: player.name,
            count: 0,
            voters: [],
          })),
      ]
    : result.voteCounts;

  const title =
    result.winner === "civilians"
      ? "Civilians win"
      : result.winner === "imposters"
        ? "Imposters win"
        : result.winner === "tie"
          ? result.skippedVoters.length === game.activePlayerIndexes.length
            ? "No votes cast"
            : "Tie vote"
          : `${eliminatedPlayer?.name} is out`;

  const description =
    result.winner === "civilians"
      ? `Every imposter was eliminated. The word was ${game.secretWord}.`
      : result.winner === "imposters"
        ? `Imposters reached parity. The word was ${game.secretWord}.`
        : result.winner === "tie"
          ? "No one is eliminated. Continue with another clue round."
          : `${eliminatedPlayer?.name} was a ${
              eliminatedPlayer?.isImposter ? "imposter" : "civilian"
            }.`;

  return (
    <GameStep
      actions={[
        gameOver
          ? { label: "Play again", onClick: game.startGame }
          : { label: "Continue", onClick: game.continueGame },
        {
          label: "New game",
          onClick: game.resetGame,
          variant: "secondary",
        },
      ]}
      description={description}
      title={title}
    >
      <ul className={styles.results}>
        {visibleVoteCounts.map((entry) => {
          const player = gameOver ? game.players[entry.playerIndex] : undefined;
          return (
            <VoteResult
              activePlayerCount={activePlayerCount}
              eliminated={result.eliminatedPlayerIndex === entry.playerIndex}
              entry={entry}
              key={entry.playerIndex}
              role={
                player
                  ? player.isImposter
                    ? "Imposter"
                    : "Civilian"
                  : undefined
              }
            />
          );
        })}
        {result.skippedVoters.length > 0 ? (
          <li className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <span className={styles.resultName}>Skipped</span>
              <small className={styles.resultCount}>
                {result.skippedVoters.length} player
                {result.skippedVoters.length === 1 ? "" : "s"}
              </small>
            </div>
            <p className={styles.mutedText}>
              {result.skippedVoters.join(", ")}
            </p>
          </li>
        ) : null}
      </ul>
    </GameStep>
  );
}
