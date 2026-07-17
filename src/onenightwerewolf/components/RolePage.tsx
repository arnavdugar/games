import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { useGame } from "../hooks/useGame";
import { roleById } from "../roles";

import * as styles from "./RolePage.css";

export function RolePage() {
  const game = useGame();
  if (game.state.phase !== "roles") return null;

  const { roles } = game;
  const state = game.state.role;
  const player = roles.players[state.playerIndex];
  const role = player?.initialRole ? roleById[player.initialRole] : null;
  if (!player || !role) return null;

  const roleArticle = /^[aeiou]/i.test(role.name) ? "an" : "a";

  const teamDescription =
    role.id === "doppelganger" ? (
      <>
        Your team becomes the <strong>team of the role you copy</strong>.
      </>
    ) : role.team === "werewolf" ? (
      <>
        You are on the <strong>werewolf team</strong>.
      </>
    ) : role.team === "tanner" ? (
      <>
        You are on <strong>your own team</strong> and win only if you are
        eliminated.
      </>
    ) : (
      <>
        You are on the <strong>village team</strong>.
      </>
    );

  const gameStep = (() => {
    switch (state.step) {
      case "handoff":
        return (
          <GameStep
            actions={[{ label: "Reveal role", onClick: roles.revealRole }]}
            description={
              <>
                Only {player.name} should look at this device. Memorize the
                role, then hide it before passing on.
              </>
            }
            title={`Pass to ${player.name}`}
          />
        );
      case "reveal":
        return (
          <GameStep
            actions={[
              { label: "Hide and pass", onClick: roles.hideRoleAndPass },
            ]}
            description={
              <>
                You are {roleArticle} <strong>{role.name}</strong>.{" "}
                {teamDescription}
                {role.nightSummary ? <> {role.nightSummary}</> : null}
              </>
            }
            title={player.name}
          >
            <div className={styles.instructionCard}>
              <span className={styles.instructionLabel}>At night</span>
              <p className={styles.instructionText}>{role.nightInstruction}</p>
            </div>
          </GameStep>
        );
    }
  })();

  return (
    <>
      {gameStep}
      <Progress
        completed={state.playerIndex}
        phase="hidden roles"
        total={roles.players.length}
      />
    </>
  );
}
