import { useState } from "preact/hooks";
import type { RotationDirection } from "../../types";
import { NightActionStep } from "../NightActionStep";
import * as nightPageStyles from "../NightPage.css";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

import * as styles from "./VillageIdiot.css";

const directions = [
  {
    key: "clockwise",
    icon: "rotate_right",
    label: "One place right",
  },
  {
    key: "counterclockwise",
    icon: "rotate_left",
    label: "One place left",
  },
] as const satisfies ReadonlyArray<{
  key: RotationDirection;
  icon: string;
  label: string;
}>;

type VillageIdiotState =
  | { step: "choosing"; direction: RotationDirection | null }
  | {
      step: "result";
      direction: RotationDirection;
      movedCardCount: number;
    };

export function VillageIdiotNightAction({
  game,
  invocation,
}: RoleNightActionProps<"village-idiot">) {
  const [state, setState] = useState<VillageIdiotState>({
    step: "choosing",
    direction: null,
  });
  const choices = buildPlayerChoices(game, invocation.actorIndex, {
    allowSelf: invocation.isDoppelgangerCopy,
  });
  const movablePlayerIndexes = choices.flatMap((choice) =>
    choice.disabled ? [] : [choice.playerIndex],
  );

  switch (state.step) {
    case "choosing": {
      if (movablePlayerIndexes.length < 2) {
        return (
          <NightResultStep
            description="There are not enough eligible roles to complete this action."
            invocation={invocation}
            finishNightAction={game.finishNightAction}
            presentation="action"
          />
        );
      }

      const submit = () => {
        const direction = state.direction!;
        game.rotatePlayerCards(movablePlayerIndexes, direction);
        setState({
          step: "result",
          direction,
          movedCardCount: movablePlayerIndexes.length,
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.direction === null,
              label: "Rotate roles",
              onClick: submit,
            },
            {
              label: "Do nothing",
              onClick: game.finishNightAction,
            },
          ]}
          invocation={invocation}
        >
          <div
            aria-label="Choose a rotation direction"
            className={styles.directionGrid}
            role="radiogroup"
          >
            {directions.map(({ icon, key, label }) => (
              <label className={styles.directionChoice} key={key}>
                <input
                  checked={state.direction === key}
                  className={nightPageStyles.hiddenInput}
                  name="rotation-direction"
                  onChange={() =>
                    setState({ step: "choosing", direction: key })
                  }
                  type="radio"
                />
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined ${styles.directionIcon}`}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description={
            <>
              You moved <strong>{state.movedCardCount}</strong> eligible roles
              one place {state.direction}.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
