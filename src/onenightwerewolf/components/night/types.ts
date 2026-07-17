import type { Game } from "../../hooks/useGame";
import type { NightActionRole, NightInvocation } from "../../types";

export interface RoleNightActionProps<Role extends NightActionRole> {
  game: Game["night"];
  invocation: NightInvocation<Role>;
}
