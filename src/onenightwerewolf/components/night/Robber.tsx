import { useState } from "preact/hooks";
import type { PlayerIndex, RoleId } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type RobberState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; playerName: string; newRole: RoleId };

export function RobberNightAction({
  game,
  invocation,
}: RoleNightActionProps<"robber">) {
  const [state, setState] = useState<RobberState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
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

      const choices = buildPlayerChoices(game, invocation.actorIndex);
      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const target = game.players[playerIndex];
        if (!target.card) return false;
        const newRole = target.card.role;
        game.swapPlayerCards(invocation.actorIndex, playerIndex);
        setState({
          step: "result",
          playerName: target.name,
          newRole,
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Exchange role",
              onClick: submit,
            },
            {
              label: "Do nothing",
              onClick: game.finishNightAction,
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
    case "result":
      return (
        <NightResultStep
          description={
            <>
              You traded roles with <strong>{state.playerName}</strong>.
              Memorize your new role.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[{ kind: "new-role", role: state.newRole }]}
        />
      );
  }
}
