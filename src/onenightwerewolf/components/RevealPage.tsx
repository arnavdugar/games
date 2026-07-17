import type { ComponentChildren } from "preact";
import { GameStep } from "../../common/components/GameStep";
import { PlayerCard } from "../../common/components/PlayerCard";
import { artifactById } from "../artifacts";
import { centerLabel } from "../center";
import { useGame } from "../hooks/useGame";
import { roleName } from "../roles";
import type { PlayerOutcome, Team } from "../types";
import { RoleBadge } from "./RoleBadge";

import * as styles from "./RevealPage.css";

const teamLabels: Record<Team, string> = {
  village: "villagers",
  werewolf: "werewolves",
  tanner: "Tanner",
};

function teamTone(team: Team): "brand" | "danger" | "warning" {
  switch (team) {
    case "village":
      return "brand";
    case "werewolf":
      return "danger";
    case "tanner":
      return "warning";
  }
}

function winnerDescription(teams: Team[]): ComponentChildren {
  const labels = teams.map((team) => teamLabels[team]);
  switch (labels.length) {
    case 0:
      return (
        <>
          <strong>No team</strong> wins.
        </>
      );
    case 1:
      return (
        <>
          <strong>The {labels[0]}</strong>{" "}
          {teams[0] === "tanner" ? "wins." : "win."}
        </>
      );
    default:
      return (
        <>
          <strong>The {labels.slice(0, -1).join(", ")}</strong> and{" "}
          <strong>the {labels[labels.length - 1]}</strong> win.
        </>
      );
  }
}

function outcomeStatus(outcome: PlayerOutcome) {
  const statuses = [outcome.eliminated ? "Eliminated" : "Survived"];
  if (outcome.protected) statuses.push("Protected");
  if (outcome.won) statuses.push("Winner");
  return statuses.join(" · ");
}

export function RevealPage() {
  const game = useGame();
  if (game.state.phase !== "reveal") return null;

  const { reveal } = game;
  const result = game.state.result;
  const votesRecorded = result.votesRecorded;

  const eliminatedOutcomes = result.playerOutcomes.filter(
    (outcome) => outcome.eliminated,
  );
  const eliminatedPlayerNames = new Intl.ListFormat(navigator.language, {
    style: "long",
    type: "conjunction",
  }).format(eliminatedOutcomes.map((outcome) => outcome.name));

  return (
    <GameStep
      actions={[
        { label: "Play again", onClick: reveal.startGame },
        {
          label: "New game",
          onClick: game.resetGame,
          variant: "secondary",
        },
      ]}
      description={
        votesRecorded ? (
          <>
            {winnerDescription(result.winningTeams)}{" "}
            {eliminatedOutcomes.length === 0 ? (
              "Every player received fewer than two eligible votes, so no one was eliminated."
            ) : (
              <>
                <strong>{eliminatedPlayerNames}</strong>{" "}
                {eliminatedOutcomes.length === 1 ? "was" : "were"} eliminated.
              </>
            )}
          </>
        ) : undefined
      }
      title={votesRecorded ? "Final result" : "Final roles"}
    >
      <section
        aria-labelledby="player-outcomes-title"
        className={styles.resultSection}
      >
        <h3 className={styles.sectionTitle} id="player-outcomes-title">
          {votesRecorded ? "Player outcomes" : "Final player roles"}
        </h3>
        <ul className={styles.cardList}>
          {result.playerOutcomes.map((outcome) => {
            const voteCount = result.voteCounts.find(
              (entry) => entry.playerIndex === outcome.playerIndex,
            );
            if (!voteCount) return null;

            const roleChanged = outcome.initialRole !== outcome.finalRole;
            const artifact = outcome.artifact
              ? artifactById[outcome.artifact]
              : null;

            return (
              <PlayerCard
                chip={{
                  label: roleName(outcome.finalRole),
                  tone: teamTone(outcome.team),
                }}
                eliminated={votesRecorded && outcome.eliminated}
                key={outcome.playerIndex}
                middleText={
                  <>
                    <span className={styles.outcomeLine}>
                      {roleChanged
                        ? `Began as ${roleName(outcome.initialRole)} → ended as ${roleName(outcome.finalRole)}`
                        : "Role did not change overnight"}
                    </span>
                    {artifact ? (
                      <span className={styles.artifactLine}>
                        <strong>{artifact.name}</strong> ·{" "}
                        {artifact.instruction}
                      </span>
                    ) : null}
                    {outcome.protected ? (
                      <span className={styles.protectedLine}>
                        Protected from elimination by a Bodyguard vote
                      </span>
                    ) : null}
                  </>
                }
                name={outcome.name}
                status={votesRecorded ? outcomeStatus(outcome) : undefined}
                voteCount={votesRecorded ? voteCount.count : undefined}
                voteTotal={
                  votesRecorded ? result.playerOutcomes.length : undefined
                }
                voters={votesRecorded ? voteCount.voters : undefined}
              />
            );
          })}
        </ul>
      </section>

      <section className={styles.resultSection} aria-labelledby="center-title">
        <h3 className={styles.sectionTitle} id="center-title">
          Final center roles
        </h3>
        <ul className={styles.centerGrid}>
          {reveal.centerCards.map((center) => (
            <li className={styles.centerCard} key={center.id}>
              <small className={styles.centerLabel}>
                {centerLabel(center.slot)}
              </small>
              <RoleBadge role={center.card.role} />
            </li>
          ))}
        </ul>
      </section>
    </GameStep>
  );
}
