import { useState } from "preact/hooks";
import { centerLabel } from "../../center";
import type { CenterSlot } from "../../types";
import { CenterPicker } from "../CenterPicker";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

type DrunkState =
  | { step: "choosing"; selectedCenters: CenterSlot[] }
  | { step: "result"; centerSlot: CenterSlot };

export function DrunkNightAction({
  game,
  invocation,
}: RoleNightActionProps<"drunk">) {
  const [state, setState] = useState<DrunkState>({
    step: "choosing",
    selectedCenters: [],
  });
  const actor = game.players[invocation.actorIndex];

  if (actor?.shielded) {
    return (
      <NightResultStep
        description={
          <>
            <strong>{actor.name}</strong>’s role is shielded, so this action
            cannot affect or reveal it.
          </>
        }
        invocation={invocation}
        finishNightAction={game.finishNightAction}
        presentation="action"
      />
    );
  }

  switch (state.step) {
    case "choosing": {
      const submit = () => {
        const centerSlot = state.selectedCenters[0];
        game.swapPlayerAndCenterCard(invocation.actorIndex, centerSlot);
        setState({ step: "result", centerSlot });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedCenters.length !== 1,
              label: "Exchange role",
              onClick: submit,
            },
          ]}
          invocation={invocation}
        >
          <CenterPicker
            centerSlots={game.centerCards.map((center) => center.slot)}
            maxSelections={1}
            onChange={(selectedCenters) =>
              setState({ step: "choosing", selectedCenters })
            }
            selected={state.selectedCenters}
          />
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description={
            <>
              You exchanged your role with the{" "}
              <strong>{centerLabel(state.centerSlot)}</strong> center role. Your
              new role remains hidden.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
