import { useState } from "preact/hooks";
import { isWerewolfRole } from "../../roles";
import type { NightReveal, PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type RevealerResult = {
  playerName: string;
  publiclyRevealed: boolean;
  reveal: Extract<NightReveal, { kind: "player" }>;
};

type RevealerState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; result: RevealerResult };

export function RevealerNightAction({
  game,
  invocation,
}: RoleNightActionProps<"revealer">) {
  const [state, setState] = useState<RevealerState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
      const faceUpPlayerIndexes = game.players.flatMap((player, playerIndex) =>
        player.faceUp ? [playerIndex] : [],
      );
      const choices = buildPlayerChoices(game, invocation.actorIndex, {
        allowSelf: invocation.isDoppelgangerCopy,
        disabledByPlayer: new Map(
          faceUpPlayerIndexes.map((playerIndex) => [
            playerIndex,
            { icon: "visibility", label: "Already face up" },
          ]),
        ),
        excludedPlayerIndexes: new Set(faceUpPlayerIndexes),
      });

      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player.card) return false;
        const role = player.card.role;
        const publiclyRevealed = !isWerewolfRole(role) && role !== "tanner";
        game.setPlayerFaceUp(playerIndex, publiclyRevealed);
        setState({
          step: "result",
          result: {
            playerName: player.name,
            publiclyRevealed,
            reveal: {
              kind: "player",
              playerIndex,
              playerName: player.name,
              role,
              visibility: publiclyRevealed ? "public" : "private",
            },
          },
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Reveal role",
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
            state.result.publiclyRevealed ? (
              <>
                <strong>{state.result.playerName}</strong>’s role stays revealed
                for everyone to see.
              </>
            ) : (
              <>
                <strong>{state.result.playerName}</strong>’s role must remain
                hidden. Only you may use what you learned.
              </>
            )
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation={state.result.publiclyRevealed ? "public" : "memorize"}
          reveals={[state.result.reveal]}
        />
      );
  }
}
