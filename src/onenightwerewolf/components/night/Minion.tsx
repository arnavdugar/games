import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

export function MinionNightAction({
  game,
  invocation,
}: RoleNightActionProps<"minion">) {
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
        reveals.length === 0 ? (
          "No player began as a werewolf. You must get another player eliminated."
        ) : (
          <>
            {reveals.length === 1
              ? "This player began as a werewolf."
              : "These players began as werewolves."}
            {dreamWolfCount > 0
              ? ` ${
                  dreamWolfCount === 1 ? "One is" : `${dreamWolfCount} are`
                } a Dream Wolf.`
              : null}
          </>
        )
      }
      invocation={invocation}
      finishNightAction={game.finishNightAction}
      presentation={reveals.length > 0 ? "memorize" : "action"}
      reveals={reveals}
    />
  );
}
