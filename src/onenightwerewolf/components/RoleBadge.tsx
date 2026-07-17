import { Chip, type ChipTone } from "../../common/components/Chip";
import { roleById } from "../roles";
import type { RoleId, Team } from "../types";

const toneByTeam: Record<Team, ChipTone> = {
  village: "brand",
  werewolf: "danger",
  tanner: "warning",
};

export function RoleBadge({ role }: { role: RoleId }) {
  const definition = roleById[role];
  return <Chip tone={toneByTeam[definition.team]}>{definition.name}</Chip>;
}
