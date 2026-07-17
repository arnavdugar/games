import { Button } from "../../common/components/Button";
import { Progress } from "../../common/components/Progress";
import {
  mutedText,
  page,
  pageTitle,
  panel,
  panelStack,
  strongText,
} from "../../styles.css";
import { useGame } from "../hooks/useGame";

export function RolePage() {
  const game = useGame();
  const player = game.currentRolePlayer;
  if (!player) return null;

  const otherImposters = game.players.filter(
    (candidate) => candidate.isImposter && candidate.id !== player.id,
  );

  return (
    <section className={page} aria-labelledby="role-title">
      {game.roleVisible ? (
        <div className={`${panelStack} ${panel}`}>
          <h2 className={pageTitle} id="role-title">
            {player.name}
          </h2>
          {player.isImposter ? (
            <>
              <p className={mutedText}>
                You are an <strong className={strongText}>imposter</strong>.{" "}
                {game.showThemeHint ? (
                  <>
                    Your hint is{" "}
                    <strong className={strongText}>{game.activeTheme}</strong>,
                    but you do not know the secret word.
                  </>
                ) : (
                  "You do not know the secret word."
                )}
              </p>
              {game.impostersKnowEachOther && otherImposters.length > 0 ? (
                <p className={mutedText}>
                  Other imposter{otherImposters.length === 1 ? "" : "s"}:{" "}
                  <strong className={strongText}>
                    {otherImposters.map((imposter) => imposter.name).join(", ")}
                  </strong>
                </p>
              ) : null}
            </>
          ) : (
            <p className={mutedText}>
              You are a <strong className={strongText}>civilian</strong>. The
              secret word is{" "}
              <strong className={strongText}>{game.secretWord}</strong>.
            </p>
          )}
          <Button onClick={game.hideRoleAndPass} type="button">
            Hide and pass
          </Button>
        </div>
      ) : (
        <div className={`${panelStack} ${panel}`}>
          <h2 className={pageTitle} id="role-title">
            Pass to {player.name}
          </h2>
          <p className={mutedText}>
            Only {player.name} should look before the device is passed on.
          </p>
          <Button onClick={game.revealRole} type="button">
            Reveal role
          </Button>
        </div>
      )}
      <Progress
        completed={game.roleIndex}
        phase="roles"
        total={game.players.length}
      />
    </section>
  );
}
