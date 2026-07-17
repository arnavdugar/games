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
import type { VoteCount } from "../types";

import * as styles from "./RevealPage.css";

function VoteResult({
  activePlayerCount,
  entry,
  role,
}: {
  activePlayerCount: number;
  entry: VoteCount;
  role?: "Imposter" | "Civilian";
}) {
  return (
    <article
      className={`${styles.resultCard} ${
        role === "Imposter" ? styles.imposterCard : ""
      }`}
    >
      <div className={styles.resultHeader}>
        <span className={styles.resultName}>
          {entry.name}
          {role ? `: ${role}` : ""}
        </span>
        <small className={styles.resultCount}>
          {entry.count} vote{entry.count === 1 ? "" : "s"}
        </small>
      </div>
      <div
        className={styles.voteBar}
        style={{
          width: `${Math.max(8, (entry.count / activePlayerCount) * 100)}%`,
        }}
      />
      <p className={mutedText}>
        {entry.voters.length > 0
          ? `Voted by ${entry.voters.join(", ")}`
          : "No votes"}
      </p>
    </article>
  );
}

export function RevealPage() {
  const game = useGame();
  const result = game.roundResult;
  if (!result) return null;

  const activePlayerCount = result.voteCounts.length;
  const gameOver =
    result.winner === "civilians" || result.winner === "imposters";
  const visibleVoteCounts = gameOver
    ? [
        ...result.voteCounts,
        ...game.players
          .filter(
            (player) =>
              !result.voteCounts.some((entry) => entry.playerId === player.id),
          )
          .map((player) => ({
            playerId: player.id,
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
          ? result.skippedVoters.length === game.activePlayers.length
            ? "No votes cast"
            : "Tie vote"
          : `${result.eliminated?.name} is out`;

  const description =
    result.winner === "civilians"
      ? `Every imposter was eliminated. The word was ${game.secretWord}.`
      : result.winner === "imposters"
        ? `Imposters reached parity. The word was ${game.secretWord}.`
        : result.winner === "tie"
          ? "No one is eliminated. Continue with another clue round."
          : `${result.eliminated?.name} was a ${
              result.eliminated?.isImposter ? "imposter" : "civilian"
            }.`;

  return (
    <section className={page} aria-labelledby="reveal-title">
      <div className={`${panelStack} ${panel}`}>
        <h2 className={pageTitle} id="reveal-title">
          {title}
        </h2>
        <p className={mutedText}>{description}</p>
        <div className={styles.results}>
          {visibleVoteCounts.map((entry) => {
            const player = gameOver
              ? game.players.find(
                  (candidate) => candidate.id === entry.playerId,
                )
              : undefined;
            return (
              <VoteResult
                activePlayerCount={activePlayerCount}
                entry={entry}
                key={entry.playerId}
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
            <article className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <span className={styles.resultName}>Skipped</span>
                <small className={styles.resultCount}>
                  {result.skippedVoters.length} player
                  {result.skippedVoters.length === 1 ? "" : "s"}
                </small>
              </div>
              <p className={mutedText}>{result.skippedVoters.join(", ")}</p>
            </article>
          ) : null}
        </div>
        <div className={actionStack}>
          {gameOver ? null : (
            <Button onClick={game.continueGame} type="button">
              Continue
            </Button>
          )}
          <Button
            onClick={game.resetGame}
            type="button"
            variant={gameOver ? "primary" : "secondary"}
          >
            New game
          </Button>
        </div>
      </div>
    </section>
  );
}
