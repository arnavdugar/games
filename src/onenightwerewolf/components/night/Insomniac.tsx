import { useState } from "preact/hooks";
import type { NightReveal, RoleId } from "../../types";
import { NightResultStep } from "../NightResultStep";
import type { RoleNightActionProps } from "./types";

type InsomniacResult =
  { kind: "blocked"; playerName: string } | { kind: "checked"; role: RoleId };

export function InsomniacNightAction({
  game,
  invocation,
}: RoleNightActionProps<"insomniac">) {
  const [result] = useState<InsomniacResult>(() => {
    const actor = game.players[invocation.actorIndex];
    if (actor?.shielded) {
      return { kind: "blocked", playerName: actor.name };
    }
    return { kind: "checked", role: actor?.card?.role ?? "insomniac" };
  });

  if (result.kind === "blocked") {
    return (
      <NightResultStep
        description={
          <>
            <strong>{result.playerName}</strong>’s role is shielded, so this
            action cannot affect or reveal it.
          </>
        }
        invocation={invocation}
        finishNightAction={game.finishNightAction}
        presentation="action"
      />
    );
  }

  const reveals: NightReveal[] = [{ kind: "current-role", role: result.role }];
  return (
    <NightResultStep
      description="This is the role in front of you now."
      invocation={invocation}
      finishNightAction={game.finishNightAction}
      presentation="memorize"
      reveals={reveals}
    />
  );
}
