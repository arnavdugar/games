import { GameStep } from "../../common/components/GameStep";
import { Progress } from "../../common/components/Progress";
import { artifactById, roleChangingArtifact } from "../artifacts";
import { useGame } from "../hooks/useGame";

import * as styles from "./ArtifactPage.css";

function ArtifactIcon() {
  return (
    <span aria-hidden="true" className={styles.artifactIcon}>
      <span className={`material-symbols-outlined ${styles.artifactIconGlyph}`}>
        token
      </span>
    </span>
  );
}

export function ArtifactPage() {
  const game = useGame();
  if (game.state.phase !== "artifacts") return null;

  const { artifacts } = game;
  const state = game.state.artifact;
  const recipient = artifacts.recipients[state.playerIndex];
  if (!recipient) return null;

  const artifact = {
    ...recipient,
    details: artifactById[recipient.artifact],
    replacesRole: roleChangingArtifact(recipient.artifact) !== null,
    recipientNumber: state.playerIndex + 1,
    recipientCount: artifacts.recipients.length,
  };

  const gameStep = (() => {
    switch (state.step) {
      case "handoff":
        return (
          <GameStep
            actions={[
              { label: "Reveal artifact", onClick: artifacts.revealArtifact },
            ]}
            beforeTitle={<ArtifactIcon />}
            description={
              <>
                Only <strong>{artifact.playerName}</strong> should look at the
                next screen. Reveal the artifact, memorize its effect, and keep
                its identity private.
              </>
            }
            title={`Pass to ${artifact.playerName}`}
          />
        );
      case "reveal": {
        const isLastArtifact =
          artifact.recipientNumber >= artifact.recipientCount;
        return (
          <GameStep
            actions={[
              {
                label: isLastArtifact
                  ? "Hide and begin discussion"
                  : "Hide and pass",
                onClick: artifacts.hideArtifactAndContinue,
              },
            ]}
            beforeTitle={<ArtifactIcon />}
            description="Do not show this screen to anyone else. During discussion, you may tell the truth or lie about this artifact."
            title={`${artifact.playerName}’s artifact`}
          >
            <div className={styles.artifactCard}>
              <span className={styles.artifactLabel}>Artifact</span>
              <h3 className={styles.artifactName}>{artifact.details.name}</h3>
              <p className={styles.artifactDescription}>
                {artifact.details.instruction}
              </p>
              {artifact.replacesRole ? (
                <p className={styles.overrideNote}>
                  This replaces your role and removes that role’s special
                  abilities.
                </p>
              ) : null}
            </div>
          </GameStep>
        );
      }
    }
  })();

  return (
    <>
      {gameStep}
      <Progress
        completed={artifact.recipientNumber - 1}
        phase="private artifacts"
        total={artifact.recipientCount}
      />
    </>
  );
}
