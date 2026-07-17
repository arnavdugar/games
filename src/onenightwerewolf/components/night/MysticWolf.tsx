import { useState } from "preact/hooks";
import type { NightReveal, PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type PlayerReveal = Extract<NightReveal, { kind: "player" }>;

type MysticWolfState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; reveal: PlayerReveal };

export function MysticWolfNightAction({
  game,
  invocation,
}: RoleNightActionProps<"mystic-wolf">) {
  const [state, setState] = useState<MysticWolfState>({
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
        if (!player.card) return false;
        setState({
          step: "result",
          reveal: {
            kind: "player",
            playerIndex,
            playerName: player.name,
            role: player.card.role,
            visibility: "private",
          },
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
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
          description="Memorize the role you inspected."
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[state.reveal]}
        />
      );
  }
}
