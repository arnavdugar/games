import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { useGame } from "../hooks/useGame";

import * as styles from "./RolePage.css";

export function RolePage() {
  const game = useGame();
  const player = game.currentRolePlayer;
  if (!player) return null;

  const otherImposters = game.players.filter(
    (candidate, candidateIndex) =>
      candidate.isImposter && candidateIndex !== game.roleIndex,
  );

  return (
    <>
      {game.roleVisible ? (
        <GameStep
          actions={[
            { label: "Hide and pass", onClick: game.hideRoleAndPass },
          ]}
          description={
            player.isImposter ? (
              <>
                You are an <strong>imposter</strong>.{" "}
                {game.showThemeHint ? (
                  <>
                    Your hint is <strong>{game.activeTheme}</strong>, but you do
                    not know the secret word.
                  </>
                ) : (
                  "You do not know the secret word."
                )}
              </>
            ) : (
              <>
                You are a <strong>civilian</strong>. The secret word is{" "}
                <strong>{game.secretWord}</strong>.
              </>
            )
          }
          title={player.name}
        >
          {player.isImposter &&
          game.impostersKnowEachOther &&
          otherImposters.length > 0 ? (
            <p className={styles.otherImposters}>
              Other imposter{otherImposters.length === 1 ? "" : "s"}:{" "}
              <strong>
                {otherImposters.map((imposter) => imposter.name).join(", ")}
              </strong>
            </p>
          ) : null}
        </GameStep>
      ) : (
        <GameStep
          actions={[{ label: "Reveal role", onClick: game.revealRole }]}
          description={
            <>Only {player.name} should look before the device is passed on.</>
          }
          title={`Pass to ${player.name}`}
        />
      )}
      <Progress
        completed={game.roleIndex}
        phase="roles"
        total={game.players.length}
      />
    </>
  );
}
