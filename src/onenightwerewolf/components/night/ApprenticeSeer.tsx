import { useState } from "preact/hooks";
import type { CenterSlot, NightReveal } from "../../types";
import { CenterPicker } from "../CenterPicker";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

type CenterReveal = Extract<NightReveal, { kind: "center" }>;

type ApprenticeSeerState =
  | { step: "choosing"; selectedCenter: CenterSlot | null }
  | { step: "result"; reveal: CenterReveal };

export function ApprenticeSeerNightAction({
  game,
  invocation,
}: RoleNightActionProps<"apprentice-seer">) {
  const [state, setState] = useState<ApprenticeSeerState>({
    step: "choosing",
    selectedCenter: null,
  });
  switch (state.step) {
    case "choosing": {
      const submit = () => {
        if (state.selectedCenter === null) return false;
        const slot = state.selectedCenter;
        const center = game.centerCards.find((card) => card.slot === slot);
        if (!center) return false;
        setState({
          step: "result",
          reveal: {
            kind: "center",
            centerSlot: slot,
            role: center.card.role,
          },
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedCenter === null,
              label: "Inspect",
              onClick: submit,
            },
            {
              label: "Do nothing",
              onClick: game.finishNightAction,
            },
          ]}
          invocation={invocation}
        >
          <CenterPicker
            centerSlots={game.centerCards.map((center) => center.slot)}
            maxSelections={1}
            onChange={(selectedCenters) =>
              setState({
                step: "choosing",
                selectedCenter: selectedCenters[0] ?? null,
              })
            }
            selected={
              state.selectedCenter === null ? [] : [state.selectedCenter]
            }
          />
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description="Memorize the role you inspected."
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[state.reveal]}
        />
      );
  }
}
