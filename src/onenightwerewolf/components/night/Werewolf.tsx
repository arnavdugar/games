import { useState } from "preact/hooks";
import type { CenterSlot, NightReveal } from "../../types";
import { CenterPicker } from "../CenterPicker";
import { NightActionStep } from "../NightActionStep";
import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

type CenterReveal = Extract<NightReveal, { kind: "center" }>;

type WerewolfState =
  | { step: "choosing"; selectedCenter: CenterSlot | null }
  | { step: "result"; reveal: CenterReveal };

export function WerewolfNightAction({
  game,
  invocation,
}: RoleNightActionProps<"werewolf">) {
  const [state, setState] = useState<WerewolfState>({
    step: "choosing",
    selectedCenter: null,
  });
  const isLoneWerewolf =
    invocation.actorIndexes.length === 1 && game.wolfIdentities.length === 1;
  if (!isLoneWerewolf) {
    const reveals = game.wolfIdentities.map(({ playerIndex, role }) => ({
      kind: "player" as const,
      playerIndex,
      playerName: game.players[playerIndex]?.name ?? "Unknown",
      role,
      visibility: "private" as const,
    }));
    const dreamWolfCount = reveals.filter(
      (reveal) => reveal.role === "dream-wolf",
    ).length;
    return (
      <NightResultStep
        description={
          <>
            {reveals.length === 1
              ? "You are the only player who began as a werewolf."
              : "These players began as werewolves."}
            {dreamWolfCount > 0
              ? ` ${
                  dreamWolfCount === 1 ? "One is" : `${dreamWolfCount} are`
                } a Dream Wolf and kept their eyes closed.`
              : null}
          </>
        }
        invocation={invocation}
        finishNightAction={game.finishNightAction}
        presentation="memorize"
        reveals={reveals}
      />
    );
  }

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
          instruction="You are the only werewolf. You may inspect one eligible center role."
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
          description="This is the center role you inspected."
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[state.reveal]}
        />
      );
  }
}
