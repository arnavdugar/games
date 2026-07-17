import { Button } from "../../common/components/Button";
import { GameStep } from "../../common/components/GameStep";
import { PlayerSetupSection } from "../../common/components/PlayerSetupSection";
import { builtInDictionaries } from "../dictionary";
import { useGame } from "../hooks/useGame";
import { PlayerOrder } from "../types";

import * as styles from "./SetupPage.css";

interface SetupPageProps {
  onStart: () => void;
}

export function SetupPage({ onStart }: SetupPageProps) {
  const game = useGame();

  const toggleTheme = (theme: string) => {
    game.setSelectedThemes((themes) =>
      themes.includes(theme)
        ? themes.filter((selectedTheme) => selectedTheme !== theme)
        : [...themes, theme],
    );
  };

  return (
    <GameStep
      actions={[
        {
          disabled: Boolean(game.setupProblem),
          label: "Start",
          onClick: onStart,
        },
      ]}
      title="Game setup"
    >
      <div className={styles.setupPanel}>
        <PlayerSetupSection
          minimumPlayers={3}
          onAddPlayer={game.addPlayer}
          onRemovePlayer={game.removePlayer}
          onUpdatePlayerName={game.updatePlayerName}
          players={game.players}
        />

        <div className={styles.section}>
          <div className={styles.fieldLabel}>
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
            className={`${styles.labelText} ${styles.headingReset}`}
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
            className={`${styles.labelText} ${styles.headingReset}`}
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

        <fieldset
          aria-labelledby="word-themes-title"
          className={styles.themeFieldset}
        >
          <header className={styles.themeHeader}>
            <div className={styles.themeSummary}>
              <h3
                className={`${styles.labelText} ${styles.headingReset} ${styles.themeTitle}`}
                id="word-themes-title"
              >
                Word themes
              </h3>
              <span className={styles.selectedCount}>
                {game.selectedThemes.length} selected
              </span>
            </div>
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
          </header>
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
              <label className={styles.fieldLabel}>
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
            <label className={styles.fieldLabel}>
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
          <p className={styles.errorMessage}>{game.setupProblem}</p>
        ) : null}
      </div>
    </GameStep>
  );
}
