import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Button } from "./Button";

import * as styles from "./PlayerSetupSection.css";

interface SetupPlayer {
  name: string;
}

interface PlayerSetupSectionProps {
  description?: ComponentChildren;
  maximumPlayers?: number;
  minimumPlayers: number;
  onAddPlayer: () => void;
  onRemovePlayer: (playerIndex: number) => void;
  onUpdatePlayerName: (playerIndex: number, name: string) => void;
  players: readonly SetupPlayer[];
}

export function PlayerSetupSection({
  description,
  maximumPlayers,
  minimumPlayers,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayerName,
  players,
}: PlayerSetupSectionProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusPlayerIndex, setFocusPlayerIndex] = useState<number | null>(null);
  const canAddPlayer =
    maximumPlayers === undefined || players.length < maximumPlayers;

  useEffect(() => {
    if (focusPlayerIndex === null) return;
    const player = players[focusPlayerIndex];
    if (!player) return;
    inputRefs.current[focusPlayerIndex]?.focus();
    setFocusPlayerIndex(null);
  }, [focusPlayerIndex, players]);

  return (
    <section aria-labelledby="player-setup-title" className={styles.section}>
      <header className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle} id="player-setup-title">
          Players
        </h3>
        <span>
          {players.length}
          {maximumPlayers === undefined ? null : ` / ${maximumPlayers}`}
        </span>
      </header>
      {description != null ? (
        <p className={styles.description}>{description}</p>
      ) : null}
      <div className={styles.playerList}>
        {players.map((player, index) => (
          <div className={styles.playerRow} key={index}>
            <span className={styles.playerNumber}>{index + 1}</span>
            <input
              aria-label={`Player ${index + 1} name`}
              maxLength={24}
              placeholder="Player name"
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              value={player.name}
              onInput={(event) =>
                onUpdatePlayerName(index, event.currentTarget.value)
              }
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                const nextPlayer = players[index + 1];
                if (nextPlayer) {
                  inputRefs.current[index + 1]?.focus();
                  return;
                }
                if (!canAddPlayer || !event.currentTarget.value.trim()) {
                  return;
                }
                setFocusPlayerIndex(index + 1);
                onAddPlayer();
              }}
            />
            <Button
              aria-label={`Remove player ${index + 1}`}
              className={styles.removeButton}
              disabled={players.length <= minimumPlayers}
              onClick={() => onRemovePlayer(index)}
              title="Remove player"
              type="button"
              variant="secondary"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                delete
              </span>
            </Button>
          </div>
        ))}
      </div>
      <Button
        disabled={!canAddPlayer}
        onClick={onAddPlayer}
        type="button"
        variant="secondary"
      >
        Add player
      </Button>
    </section>
  );
}
