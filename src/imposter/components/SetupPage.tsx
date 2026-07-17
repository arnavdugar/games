import { useEffect, useRef, useState } from "preact/hooks";
import { Button } from "../../common/components/Button";
import {
  errorMessage,
  fieldLabel,
  labelText,
  page,
  pageTitle,
  panel,
  sectionHeader,
} from "../../styles.css";
import { builtInDictionaries } from "../dictionary";
import { useGame } from "../hooks/useGame";
import { PlayerOrder } from "../types";

import * as styles from "./SetupPage.css";

export function SetupPage() {
  const game = useGame();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusPlayerIndex, setFocusPlayerIndex] = useState<number | null>(null);

  const toggleTheme = (theme: string) => {
    game.setSelectedThemes((themes) =>
      themes.includes(theme)
        ? themes.filter((selectedTheme) => selectedTheme !== theme)
        : [...themes, theme],
    );
  };

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
        <div className={styles.section}>
          <div className={sectionHeader}>
            <span className={labelText}>Players</span>
            <span>{game.playerCount}</span>
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
                      return;
                    }
                    if (event.currentTarget.value.trim()) {
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
          <Button onClick={game.addPlayer} type="button" variant="secondary">
            Add player
          </Button>
        </div>

        <div className={styles.section}>
          <div className={fieldLabel}>
            <span>Imposters</span>
            <div
              aria-label="Number of imposters"
              className={styles.stepper}
              role="group"
            >
              <Button
                aria-label="Decrease imposters"
                className={styles.stepperButton}
                disabled={game.imposterCount <= 1}
                onClick={() => game.setImposterCount(game.imposterCount - 1)}
                type="button"
                variant="secondary"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  remove
                </span>
              </Button>
              <output aria-live="polite" className={styles.stepperValue}>
                {game.imposterCount}
              </output>
              <Button
                aria-label="Increase imposters"
                className={styles.stepperButton}
                disabled={game.imposterCount >= game.maxImposters}
                onClick={() => game.setImposterCount(game.imposterCount + 1)}
                type="button"
                variant="secondary"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  add
                </span>
              </Button>
            </div>
          </div>
        </div>

        <section
          aria-labelledby="player-order-title"
          className={styles.section}
          role="radiogroup"
        >
          <h3
            className={`${labelText} ${styles.headingReset}`}
            id="player-order-title"
          >
            Player order
          </h3>
          <label className={styles.controlOption}>
            <input
              checked={game.playerOrder === PlayerOrder.Fixed}
              className={styles.inputControl}
              name="player-order"
              onChange={() => game.setPlayerOrder(PlayerOrder.Fixed)}
              type="radio"
            />
            Do not randomize
          </label>
          <label className={styles.controlOption}>
            <input
              checked={game.playerOrder === PlayerOrder.RandomStart}
              className={styles.inputControl}
              name="player-order"
              onChange={() => game.setPlayerOrder(PlayerOrder.RandomStart)}
              type="radio"
            />
            Randomize starting player
          </label>
          <label className={styles.controlOption}>
            <input
              checked={game.playerOrder === PlayerOrder.Random}
              className={styles.inputControl}
              name="player-order"
              onChange={() => game.setPlayerOrder(PlayerOrder.Random)}
              type="radio"
            />
            Randomize all players
          </label>
        </section>

        <section aria-labelledby="settings-title" className={styles.section}>
          <h3
            className={`${labelText} ${styles.headingReset}`}
            id="settings-title"
          >
            Settings
          </h3>
          <label className={styles.controlOption}>
            <input
              checked={game.showThemeHint}
              className={styles.inputControl}
              onChange={(event) =>
                game.setShowThemeHint(event.currentTarget.checked)
              }
              type="checkbox"
            />
            Show word theme as the imposter hint
          </label>
          <label className={styles.controlOption}>
            <input
              checked={game.allowAbstaining}
              className={styles.inputControl}
              onChange={(event) =>
                game.setAllowAbstaining(event.currentTarget.checked)
              }
              type="checkbox"
            />
            Allow abstaining
          </label>
          <label className={styles.controlOption}>
            <input
              checked={game.impostersKnowEachOther}
              className={styles.inputControl}
              onChange={(event) =>
                game.setImpostersKnowEachOther(event.currentTarget.checked)
              }
              type="checkbox"
            />
            Imposters know each other
          </label>
        </section>

        <fieldset className={styles.themeFieldset}>
          <legend className={labelText}>Word themes</legend>
          <div className={styles.themeHeader}>
            <span className={styles.selectedCount}>
              {game.selectedThemes.length} selected
            </span>
            <div className={styles.themeActions}>
              <Button
                className={styles.smallButton}
                disabled={builtInDictionaries.every((dictionary) =>
                  game.selectedThemes.includes(dictionary.theme),
                )}
                onClick={() =>
                  game.setSelectedThemes((themes) => [
                    ...builtInDictionaries.map(
                      (dictionary) => dictionary.theme,
                    ),
                    ...(themes.includes("Custom") ? ["Custom"] : []),
                  ])
                }
                type="button"
                variant="secondary"
              >
                All built-in
              </Button>
              <Button
                className={styles.smallButton}
                disabled={game.selectedThemes.length === 0}
                onClick={() => game.setSelectedThemes([])}
                type="button"
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className={styles.themeGrid}>
            {builtInDictionaries.map((dictionary) => {
              const selected = game.selectedThemes.includes(dictionary.theme);
              return (
                <label
                  className={`${styles.themeOption} ${selected ? styles.selectedOption : ""}`}
                  key={dictionary.theme}
                >
                  <input
                    checked={selected}
                    className={styles.inputControl}
                    onChange={() => toggleTheme(dictionary.theme)}
                    type="checkbox"
                  />
                  {dictionary.theme}
                </label>
              );
            })}
            <label
              className={`${styles.themeOption} ${
                game.selectedThemes.includes("Custom")
                  ? styles.selectedOption
                  : ""
              }`}
            >
              <input
                checked={game.selectedThemes.includes("Custom")}
                className={styles.inputControl}
                onChange={() => toggleTheme("Custom")}
                type="checkbox"
              />
              Custom
            </label>
          </div>
        </fieldset>

        {game.selectedThemes.includes("Custom") ? (
          <div className={styles.section}>
            {game.showThemeHint ? (
              <label className={fieldLabel}>
                Custom theme hint
                <input
                  required
                  value={game.customTheme}
                  onInput={(event) =>
                    game.setCustomTheme(event.currentTarget.value)
                  }
                />
              </label>
            ) : null}
            <label className={fieldLabel}>
              Secret words
              <textarea
                value={game.customWords}
                onInput={(event) =>
                  game.setCustomWords(event.currentTarget.value)
                }
                rows={5}
              />
            </label>
          </div>
        ) : null}

        {game.setupProblem ? (
          <p className={errorMessage}>{game.setupProblem}</p>
        ) : null}
        <Button
          disabled={Boolean(game.setupProblem)}
          onClick={game.startGame}
          type="button"
        >
          Start
        </Button>
      </div>
    </section>
  );
}
