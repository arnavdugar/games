import { useEffect, useRef, useState } from "preact/hooks";
import { Button } from "../../common/components/Button";
import {
  errorMessage,
  labelText,
  mutedText,
  page,
  pageTitle,
  panel,
  sectionHeader,
  warningMessage,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";
import { roleDefinitions } from "../roles";
import { RoleBadge } from "./RoleBadge";

import * as styles from "./SetupPage.css";

export function SetupPage() {
  const game = useGame();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusPlayerIndex, setFocusPlayerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusPlayerIndex === null) return;
    const player = game.players[focusPlayerIndex];
    if (player) {
      inputRefs.current[player.id]?.focus();
      setFocusPlayerIndex(null);
    }
  }, [focusPlayerIndex, game.players]);

  return (
    <section className={page} aria-labelledby="setup-title">
      <div className={`${styles.setupPanel} ${panel}`}>
        <h2 className={pageTitle} id="setup-title">
          Game setup
        </h2>
        <p className={warningMessage}>
          Use a narration app on a different device for the night phase and day
          timer.
        </p>

        <div className={styles.section}>
          <div className={sectionHeader}>
            <span className={labelText}>Players</span>
            <span>{game.playerCount} / 10</span>
          </div>
          <div className={styles.playerList}>
            {game.players.map((player, index) => (
              <div className={styles.playerRow} key={player.id}>
                <span className={styles.playerNumber}>{index + 1}</span>
                <input
                  aria-label={`Player ${index + 1} name`}
                  placeholder="Player name"
                  ref={(input) => {
                    inputRefs.current[player.id] = input;
                  }}
                  value={player.name}
                  onInput={(event) =>
                    game.updatePlayerName(player.id, event.currentTarget.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const nextPlayer = game.players[index + 1];
                    if (nextPlayer) {
                      inputRefs.current[nextPlayer.id]?.focus();
                    } else if (game.players.length < 10) {
                      setFocusPlayerIndex(index + 1);
                      game.addPlayer();
                    }
                  }}
                />
                <Button
                  aria-label={`Remove player ${index + 1}`}
                  className={styles.removeButton}
                  disabled={game.players.length <= 3}
                  onClick={() => game.removePlayer(player.id)}
                  title="Remove player"
                  type="button"
                  variant="secondary"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined"
                  >
                    delete
                  </span>
                </Button>
              </div>
            ))}
          </div>
          <Button
            disabled={game.players.length >= 10}
            onClick={game.addPlayer}
            type="button"
            variant="secondary"
          >
            Add player
          </Button>
        </div>

        <div className={styles.section}>
          <div className={styles.roleHeader}>
            <div>
              <h3 className={styles.headingReset}>Characters</h3>
              <span className={styles.selectedCount}>
                {game.selectedRoles.length} selected · {game.requiredRoleCount}{" "}
                needed
              </span>
            </div>
            <Button
              className={styles.recommendButton}
              onClick={game.useRecommendedRoles}
              type="button"
              variant="secondary"
            >
              Use recommended set
            </Button>
          </div>
          <div className={styles.roleList}>
            {roleDefinitions.map((role) => {
              const count = game.roleCounts[role.id] ?? 0;
              return (
                <article
                  className={`${styles.roleCard} ${count > 0 ? styles.selectedRoleCard : ""}`}
                  key={role.id}
                >
                  <div className={styles.roleDetails}>
                    <RoleBadge role={role.id} />
                    <p className={styles.roleSummary}>{role.summary}</p>
                  </div>
                  <div
                    aria-label={`${role.name} role count`}
                    className={styles.stepper}
                    role="group"
                  >
                    <Button
                      aria-label={`Remove ${role.name}`}
                      className={styles.stepperButton}
                      disabled={count === 0}
                      onClick={() => game.removeRole(role.id)}
                      type="button"
                      variant="secondary"
                    >
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                      >
                        remove
                      </span>
                    </Button>
                    <output className={styles.stepperValue}>{count}</output>
                    <Button
                      aria-label={`Add ${role.name}`}
                      className={styles.stepperButton}
                      disabled={count + role.increment > role.max}
                      onClick={() => game.addRole(role.id)}
                      type="button"
                      variant="secondary"
                    >
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                      >
                        add
                      </span>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {game.setupProblem ? (
          <p className={errorMessage}>{game.setupProblem}</p>
        ) : null}
        <Button
          disabled={Boolean(game.setupProblem)}
          onClick={game.startGame}
          type="button"
        >
          Deal hidden roles
        </Button>
      </div>
    </section>
  );
}
