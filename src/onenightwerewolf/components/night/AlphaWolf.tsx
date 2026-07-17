import { useState } from "preact/hooks";
import type { PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type AlphaWolfState =
  | { step: "choosing"; selectedPlayer: PlayerIndex | null }
  | { step: "result"; playerName: string };

export function AlphaWolfNightAction({
  game,
  invocation,
}: RoleNightActionProps<"alpha-wolf">) {
  const [state, setState] = useState<AlphaWolfState>({
    step: "choosing",
    selectedPlayer: null,
  });
  switch (state.step) {
    case "choosing": {
      const originalAlphaWolfIndexes = game.players.flatMap(
        (player, playerIndex) =>
          player.initialRole === "alpha-wolf" ? [playerIndex] : [],
      );
      const copiedAction = invocation.isDoppelgangerCopy;
      const wolfIdentityIndexes = game.wolfIdentities.map(
        ({ playerIndex }) => playerIndex,
      );
      const excludedIndexes = new Set(
        copiedAction ? originalAlphaWolfIndexes : wolfIdentityIndexes,
      );
      const choices = buildPlayerChoices(game, invocation.actorIndex, {
        disabledByPlayer: copiedAction
          ? new Map(
              originalAlphaWolfIndexes.map((playerIndex) => [
                playerIndex,
                { icon: "block", label: "Original Alpha Wolf" },
              ]),
            )
          : undefined,
        excludedPlayerIndexes: excludedIndexes,
        visibleRoles: copiedAction
          ? new Map(
              originalAlphaWolfIndexes.map((playerIndex) => [
                playerIndex,
                "alpha-wolf" as const,
              ]),
            )
          : undefined,
      });
      const legalPlayerIndexes = choices.flatMap((choice) =>
        choice.disabled ? [] : [choice.playerIndex],
      );

      if (legalPlayerIndexes.length === 0) {
        return (
          <NightResultStep
            description="There are no eligible targets, so this action has no effect."
            invocation={invocation}
            finishNightAction={game.finishNightAction}
            presentation="action"
          />
        );
      }

      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player) return false;
        game.swapPlayerAndCenterCard(playerIndex, "alpha-wolf");
        setState({ step: "result", playerName: player.name });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Exchange role",
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
    case "result":
      return (
        <NightResultStep
          description={
            <>
              You exchanged the Alpha Wolf center role with{" "}
              <strong>{state.playerName}</strong>’s role. Neither role was
              revealed.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="action"
        />
      );
  }
}
