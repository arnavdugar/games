import { useState } from "preact/hooks";
import { isImmediateDoppelgangerRole, roleById } from "../../roles";
import type { PlayerIndex, RoleId } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type DoppelgangerState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; copiedRole: RoleId };

export function DoppelgangerNightAction({
  game,
  invocation,
}: RoleNightActionProps<"doppelganger">) {
  const [state, setState] = useState<DoppelgangerState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
      const choices = buildPlayerChoices(game, invocation.actorIndex);
      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const copiedRole = game.recordDoppelgangerCopy(state.selectedPlayer);
        if (!isImmediateDoppelgangerRole(copiedRole)) {
          setState({ step: "result", copiedRole });
        }
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Copy role",
              onClick: submit,
            },
          ]}
          invocation={invocation}
        >
          <PlayerPicker
            choices={choices}
            maxSelections={1}
            onChange={(selectedPlayers) =>
              setState({
                step: "choosing",
                selectedPlayer: selectedPlayers[0] ?? null,
              })
            }
            selected={
              state.selectedPlayer === null ? [] : [state.selectedPlayer]
            }
          />
        </NightActionStep>
      );
    }
    case "result": {
      const copiedRole = roleById[state.copiedRole];
      return (
        <NightResultStep
          description={
            <>
              You copied the <strong>{copiedRole.name}</strong>.
              {copiedRole.doppelgangerFollowUp
                ? ` ${copiedRole.doppelgangerFollowUp}`
                : null}
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[{ kind: "copied-role", role: state.copiedRole }]}
        />
      );
    }
  }
}
