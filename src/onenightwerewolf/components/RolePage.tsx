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
import { roleById } from "../roles";

import * as styles from "./RolePage.css";

export function RolePage() {
  const game = useGame();
  const player = game.currentRolePlayer;
  const role = player?.initialRole ? roleById[player.initialRole] : null;
  if (!player || !role) return null;

  const roleArticle = /^[aeiou]/i.test(role.name) ? "an" : "a";

  const teamDescription =
    role.id === "doppelganger" ? (
      <>
        Your team becomes the{" "}
        <strong className={strongText}>team of the role you copy</strong>.
      </>
    ) : role.team === "werewolf" ? (
      <>
        You are on the <strong className={strongText}>werewolf team</strong>.
      </>
    ) : role.team === "tanner" ? (
      <>
        You are on <strong className={strongText}>your own team</strong> and win
        only if you are eliminated.
      </>
    ) : (
      <>
        You are on the <strong className={strongText}>village team</strong>.
      </>
    );

  return (
    <section className={page} aria-labelledby="role-title">
      {game.roleVisible ? (
        <div className={`${panelStack} ${panel}`}>
          <h2 className={pageTitle} id="role-title">
            {player.name}
          </h2>
          <p className={mutedText}>
            You are {roleArticle}{" "}
            <strong className={strongText}>{role.name}</strong>.{" "}
            {teamDescription} {role.summary}
          </p>
          <div className={styles.instructionCard}>
            <span className={styles.instructionLabel}>At night</span>
            <p className={styles.instructionText}>{role.nightInstruction}</p>
          </div>
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
            Only {player.name} should look at this device. Memorize the role,
            then hide it before passing on.
          </p>
          <Button onClick={game.revealRole} type="button">
            Reveal role
          </Button>
        </div>
      )}
      <Progress
        completed={game.roleIndex}
        phase="hidden roles"
        total={game.players.length}
      />
    </section>
  );
}
