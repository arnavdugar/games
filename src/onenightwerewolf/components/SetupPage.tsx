import { Button } from "../../common/components/Button";
import { GameStep } from "../../common/components/GameStep";
import { PlayerSetupSection } from "../../common/components/PlayerSetupSection";
import { useGame } from "../hooks/useGame";
import { roleDefinitions } from "../roles";

import * as styles from "./SetupPage.css";

interface SetupPageProps {
  onStart: () => void;
}

export function SetupPage({ onStart }: SetupPageProps) {
  const { setup } = useGame();

  return (
    <GameStep
      actions={[
        {
          disabled: Boolean(setup.setupProblem),
          label: "Start",
          onClick: onStart,
        },
      ]}
      title="Game setup"
    >
      <div className={styles.setupPanel}>
        <p className={styles.warningMessage}>
          Use a narration app on a different device for the night phase and day
          timer.
        </p>

        <PlayerSetupSection
          description="Enter players in clockwise seating order so in-game movements match the table."
          maximumPlayers={10}
          minimumPlayers={3}
          onAddPlayer={setup.addPlayer}
          onRemovePlayer={setup.removePlayer}
          onUpdatePlayerName={setup.updatePlayerName}
          players={setup.players}
        />

        <div className={styles.section}>
          <header className={styles.sectionHeader}>
            <div className={styles.sectionSummary}>
              <h3 className={styles.sectionTitle}>Roles</h3>
              <span className={styles.roleCount}>
                {setup.selectedRoles.length} selected ·{" "}
                {setup.requiredRoleCount} needed
              </span>
            </div>
            <div className={styles.roleActions}>
              <Button
                className={styles.roleActionButton}
                onClick={setup.useRecommendedRoles}
                type="button"
                variant="secondary"
              >
                Use recommended set
              </Button>
              <Button
                className={styles.roleActionButton}
                disabled={setup.selectedRoles.length === 0}
                onClick={setup.clearRoles}
                type="button"
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </header>
          <ul className={styles.roleList}>
            {roleDefinitions.map((role) => {
              const count = setup.roleCounts[role.id] ?? 0;
              return (
                <li className={styles.roleCard} key={role.id}>
                  <label className={styles.roleSelection}>
                    <input
                      aria-label={`Select ${role.name}`}
                      checked={count > 0}
                      className={styles.inputControl}
                      onChange={(event) =>
                        setup.setRoleCount(
                          role.id,
                          event.currentTarget.checked ? role.increment : 0,
                        )
                      }
                      type="checkbox"
                    />
                    <div className={styles.roleDetails}>
                      <h4 className={styles.roleName}>{role.name}</h4>
                      <p className={styles.roleSummary}>{role.setupSummary}</p>
                    </div>
                  </label>
                  {role.max > 1 ? (
                    <div
                      aria-label={`${role.name} role count`}
                      className={styles.stepper}
                      role="group"
                    >
                      <Button
                        aria-label={`Remove ${role.name}`}
                        className={styles.stepperButton}
                        disabled={count === 0}
                        onClick={() =>
                          setup.setRoleCount(role.id, count - role.increment)
                        }
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
                        onClick={() =>
                          setup.setRoleCount(role.id, count + role.increment)
                        }
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
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <section aria-labelledby="settings-title" className={styles.section}>
          <h3 className={styles.sectionTitle} id="settings-title">
            Settings
          </h3>
          <label className={styles.controlOption}>
            <input
              checked={setup.skipDeviceFreeNightActions}
              className={styles.inputControl}
              onChange={(event) =>
                setup.setSkipDeviceFreeNightActions(event.currentTarget.checked)
              }
              type="checkbox"
            />
            Skip night actions that don’t need this device
          </label>
        </section>

        {setup.setupProblem ? (
          <p className={styles.errorMessage}>{setup.setupProblem}</p>
        ) : null}
      </div>
    </GameStep>
  );
}
