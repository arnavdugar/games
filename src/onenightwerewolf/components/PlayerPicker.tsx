import type { Game } from "../hooks/useGame";
import type { PlayerIndex, RoleId } from "../types";
import { RoleBadge } from "./RoleBadge";

import * as styles from "./PlayerPicker.css";

export interface DisabledChoice {
  icon: string;
  label: string;
}

export interface PlayerChoice {
  playerIndex: PlayerIndex;
  playerName: string;
  visibleRole: RoleId | null;
  disabled: DisabledChoice | null;
}

export function buildPlayerChoices(
  game: Pick<Game["night"], "getNightPlayerTargets">,
  actorIndex: PlayerIndex,
  options: {
    allowSelf?: boolean;
    allowShielded?: boolean;
    excludedPlayerIndexes?: ReadonlySet<PlayerIndex>;
    disabledByPlayer?: ReadonlyMap<PlayerIndex, DisabledChoice>;
    visibleRoles?: ReadonlyMap<PlayerIndex, RoleId>;
  } = {},
): PlayerChoice[] {
  const { disabledByPlayer = new Map(), ...targetOptions } = options;

  return game.getNightPlayerTargets(actorIndex, targetOptions).map((target) => {
    let disabled: DisabledChoice | null = null;

    if (!target.available) {
      disabled = target.shielded
        ? { icon: "shield_lock", label: "Shielded" }
        : (disabledByPlayer.get(target.playerIndex) ??
          (target.isActor
            ? { icon: "person", label: "Your role" }
            : { icon: "block", label: "Unavailable" }));
    }

    return {
      playerIndex: target.playerIndex,
      playerName: target.playerName,
      visibleRole: target.visibleRole,
      disabled,
    };
  });
}

export function PlayerPicker({
  choices,
  maxSelections,
  onChange,
  selected,
}: {
  choices: PlayerChoice[];
  maxSelections: number;
  onChange: (selected: PlayerIndex[]) => void;
  selected: PlayerIndex[];
}) {
  const available = choices.some((choice) => !choice.disabled);
  return (
    <>
      <div className={styles.choiceList}>
        {choices.map((choice) => (
          <label className={styles.choice} key={choice.playerIndex}>
            <input
              checked={selected.includes(choice.playerIndex)}
              className={styles.hiddenInput}
              disabled={choice.disabled !== null}
              onChange={() => {
                if (selected.includes(choice.playerIndex)) {
                  onChange(
                    selected.filter((index) => index !== choice.playerIndex),
                  );
                } else if (maxSelections === 1) {
                  onChange([choice.playerIndex]);
                } else if (selected.length < maxSelections) {
                  onChange([...selected, choice.playerIndex]);
                }
              }}
              type="checkbox"
            />
            <span className={styles.choiceName}>{choice.playerName}</span>
            {choice.visibleRole ? (
              <RoleBadge role={choice.visibleRole} />
            ) : null}
            {choice.disabled ? (
              <>
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined ${styles.choiceStatusIcon}`}
                >
                  {choice.disabled.icon}
                </span>
                <span className={styles.choiceStatus}>
                  {choice.disabled.label}
                </span>
              </>
            ) : null}
          </label>
        ))}
      </div>
      {!available ? (
        <p className={styles.emptyNotice}>No eligible targets are available.</p>
      ) : null}
    </>
  );
}
