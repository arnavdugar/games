import { useState } from "preact/hooks";
import type { PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type SentinelState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; playerName: string };

export function SentinelNightAction({
  game,
  invocation,
}: RoleNightActionProps<"sentinel">) {
  const [state, setState] = useState<SentinelState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
      const choices = buildPlayerChoices(game, invocation.actorIndex);
      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player) return false;
        game.shieldPlayer(playerIndex);
        setState({ step: "result", playerName: player.name });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Place shield",
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
              You placed a shield on <strong>{state.playerName}</strong>. That
              role cannot move for the rest of the night.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
