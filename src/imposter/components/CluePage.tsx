import { Button } from "../../common/components/Button";
import { Progress } from "../../common/components/Progress";
import {
  fieldLabel,
  mutedText,
  page,
  pageTitle,
  panel,
  panelStack,
  sectionHeader,
  warningMessage,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";
import { characterCount } from "./CluePage.css";

export function CluePage() {
  const game = useGame();
  const player = game.currentCluePlayer;
  if (!player) return null;

  return (
    <section className={page} aria-labelledby="clue-title">
      <div className={`${panelStack} ${panel}`}>
        <h2 className={pageTitle} id="clue-title">
          Clue from {player.name}
        </h2>
        <p className={mutedText}>
          {game.showThemeHint ? (
            <>
              Theme hint: <strong>{game.activeTheme}</strong>.{" "}
            </>
          ) : null}
          Give one short clue without typing the secret word directly.
        </p>
        <label className={fieldLabel}>
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
        <div className={`${sectionHeader} ${characterCount}`}>
          <span>{game.currentClue.trim().length}/40 characters</span>
        </div>
        {game.clueContainsSecret ? (
          <p className={warningMessage} role="status">
            This clue contains the secret word. Consider using a related hint.
          </p>
        ) : null}
        <Button
          disabled={!game.currentClue.trim()}
          onClick={game.submitClue}
          type="button"
        >
          Submit clue
        </Button>
      </div>
      <Progress
        completed={game.clueIndex}
        phase="clues"
        roundNumber={game.roundNumber}
        total={game.activePlayers.length}
      />
    </section>
  );
}
