import { useState } from "preact/hooks";
import type { PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type CuratorState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; playerName: string };

export function CuratorNightAction({
  game,
  invocation,
}: RoleNightActionProps<"curator">) {
  const [state, setState] = useState<CuratorState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
      const artifactPlayerIndexes = game.players.flatMap(
        (player, playerIndex) => (player.artifact ? [playerIndex] : []),
      );
      const choices = buildPlayerChoices(game, invocation.actorIndex, {
        allowSelf: true,
        disabledByPlayer: new Map(
          artifactPlayerIndexes.map((playerIndex) => [
            playerIndex,
            { icon: "token", label: "Already has an artifact" },
          ]),
        ),
        excludedPlayerIndexes: new Set(artifactPlayerIndexes),
      });

      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player) return false;
        game.placeRandomArtifact(playerIndex);
        setState({ step: "result", playerName: player.name });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Place artifact",
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
              You gave <strong>{state.playerName}</strong> a face-down artifact.
              Do not look at it.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
