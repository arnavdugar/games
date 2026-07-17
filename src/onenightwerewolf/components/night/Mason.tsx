import type { NightReveal } from "../../types";
import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

type PlayerReveal = Extract<NightReveal, { kind: "player" }>;

export function MasonNightAction({
  game,
  invocation,
}: RoleNightActionProps<"mason">) {
  const reveals: PlayerReveal[] = invocation.actorIndexes.map(
    (playerIndex) => ({
      kind: "player",
      playerIndex,
      playerName: game.players[playerIndex]?.name ?? "Unknown",
      role: "mason",
      visibility: "private",
    }),
  );
  return (
    <NightResultStep
      description={
        reveals.length === 1
          ? "You are the only Mason among the players."
          : "These players began as Masons."
      }
      invocation={invocation}
      finishNightAction={game.finishNightAction}
      presentation="memorize"
      reveals={reveals}
    />
  );
}
