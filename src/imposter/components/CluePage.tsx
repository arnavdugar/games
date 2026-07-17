import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { useGame } from "../hooks/useGame";

import * as styles from "./CluePage.css";

export function CluePage() {
  const game = useGame();
  const player = game.currentCluePlayer;
  if (!player) return null;

  return (
    <>
      <GameStep
        actions={[
          {
            disabled: !game.currentClue.trim(),
            label: "Submit clue",
            onClick: game.submitClue,
          },
        ]}
        description={
          <>
            {game.showThemeHint ? (
              <>
                Theme hint: <strong>{game.activeTheme}</strong>.{" "}
              </>
            ) : null}
            Give one short clue without typing the secret word directly.
          </>
        }
        title={`Clue from ${player.name}`}
      >
        <label className={styles.fieldLabel}>
          Your clue
          <input
            autoFocus
            maxLength={40}
            value={game.currentClue}
            onInput={(event) => game.setCurrentClue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") game.submitClue();
            }}
          />
        </label>
        <div className={styles.characterCount}>
          <span>{game.currentClue.trim().length}/40 characters</span>
        </div>
        {game.clueContainsSecret ? (
          <p className={styles.warningMessage} role="status">
            This clue contains the secret word. Consider using a related hint.
          </p>
        ) : null}
      </GameStep>
      <Progress
        completed={game.clueIndex}
        phase="clues"
        roundNumber={game.roundNumber}
        total={game.activePlayerIndexes.length}
      />
    </>
  );
}
