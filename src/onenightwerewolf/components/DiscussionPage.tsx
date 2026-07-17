import { GameStep } from "../../common/components/GameStep";
import { useGame } from "../hooks/useGame";
import { RoleBadge } from "./RoleBadge";

import * as styles from "./DiscussionPage.css";

export function DiscussionPage() {
  const { discussion } = useGame();

  return (
    <GameStep
      actions={[
        { label: "Start hidden voting", onClick: discussion.startVoting },
        {
          label: "Reveal roles",
          onClick: discussion.revealRoles,
          variant: "secondary",
        },
      ]}
      beforeTitle={
        <span aria-hidden="true" className={styles.sunIcon}>
          <span className={`material-symbols-outlined ${styles.sunIconGlyph}`}>
            light_mode
          </span>
        </span>
      }
      description="Start the narrator’s day timer. Share information, bluff, and reconstruct how the roles moved during the night."
      title="Day phase"
    >
      <ul aria-label="Public roles and markers" className={styles.playerList}>
        {discussion.players.map((player, playerIndex) =>
          player.faceUp || player.shielded || player.artifact ? (
            <li className={styles.playerCard} key={playerIndex}>
              <strong className={styles.playerName}>{player.name}</strong>
              <div className={styles.publicDetails}>
                {player.faceUp && player.card ? (
                  <RoleBadge role={player.card.role} />
                ) : null}
                {player.shielded ? (
                  <span
                    aria-label={`${player.name}’s role is protected by a shield`}
                    className={styles.marker}
                  >
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined ${styles.markerIcon}`}
                    >
                      shield
                    </span>
                    Shield
                  </span>
                ) : null}
                {player.artifact ? (
                  <span
                    aria-label={`${player.name} has a face-down artifact`}
                    className={styles.marker}
                  >
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined ${styles.markerIcon}`}
                    >
                      token
                    </span>
                    Artifact
                  </span>
                ) : null}
              </div>
            </li>
          ) : null,
        )}
      </ul>
    </GameStep>
  );
}
