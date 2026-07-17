import { useState } from "preact/hooks";
import type { PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type TroublemakerState =
  | { step: "choosing"; selectedPlayers: PlayerIndex[] }
  | {
      step: "result";
      firstPlayerName: string;
      secondPlayerName: string;
    };

export function TroublemakerNightAction({
  game,
  invocation,
}: RoleNightActionProps<"troublemaker">) {
  const [state, setState] = useState<TroublemakerState>({
    step: "choosing",
    selectedPlayers: [],
  });
  switch (state.step) {
    case "choosing": {
      const choices = buildPlayerChoices(game, invocation.actorIndex);
      const submit = () => {
        const [firstPlayerIndex, secondPlayerIndex] = state.selectedPlayers;
        const firstPlayer = game.players[firstPlayerIndex];
        const secondPlayer = game.players[secondPlayerIndex];
        game.swapPlayerCards(firstPlayerIndex, secondPlayerIndex);
        setState({
          step: "result",
          firstPlayerName: firstPlayer.name,
          secondPlayerName: secondPlayer.name,
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayers.length !== 2,
              label: "Swap roles",
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
            maxSelections={2}
            onChange={(selectedPlayers) =>
              setState({ step: "choosing", selectedPlayers })
            }
            selected={state.selectedPlayers}
          />
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description={
            <>
              You swapped <strong>{state.firstPlayerName}</strong> and{" "}
              <strong>{state.secondPlayerName}</strong>. Their roles remain
              hidden.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
