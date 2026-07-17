import type { RoleCard, Team } from "./types";

interface RoleDefinitionShape {
  id: string;
  name: string;
  team: Team;
  max: number;
  increment: number;
  summary: string;
  nightInstruction: string;
}

export const roleDefinitions = [
  {
    id: "doppelganger",
    name: "Doppelgänger",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Copy another player's role and team.",
    nightInstruction:
      "Look at another player's role. You become that role and may act immediately.",
  },
  {
    id: "werewolf",
    name: "Werewolf",
    team: "werewolf",
    max: 2,
    increment: 1,
    summary: "Avoid having a werewolf eliminated.",
    nightInstruction:
      "Find the other werewolf. A lone werewolf may inspect one center role.",
  },
  {
    id: "minion",
    name: "Minion",
    team: "werewolf",
    max: 1,
    increment: 1,
    summary: "Help the werewolves survive, even at your own expense.",
    nightInstruction: "Learn which players began as werewolves.",
  },
  {
    id: "mason",
    name: "Mason",
    team: "village",
    max: 2,
    increment: 2,
    summary: "Know who the other Mason is.",
    nightInstruction: "Find the other player who began as a Mason.",
  },
  {
    id: "seer",
    name: "Seer",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Inspect one player role or two center roles.",
    nightInstruction:
      "Look at one other player's role or any two center roles.",
  },
  {
    id: "robber",
    name: "Robber",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Trade roles with another player, then see your new role.",
    nightInstruction:
      "Swap your role with another player's role and view the role you received.",
  },
  {
    id: "troublemaker",
    name: "Troublemaker",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Secretly swap two other players' roles.",
    nightInstruction:
      "Choose two other players and swap their roles without viewing them.",
  },
  {
    id: "drunk",
    name: "Drunk",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Exchange your role with an unseen center role.",
    nightInstruction:
      "Swap your role with one center role. Do not look at the new role.",
  },
  {
    id: "insomniac",
    name: "Insomniac",
    team: "village",
    max: 1,
    increment: 1,
    summary: "Check whether your role changed during the night.",
    nightInstruction: "Look at the role currently in front of you.",
  },
  {
    id: "villager",
    name: "Villager",
    team: "village",
    max: 3,
    increment: 1,
    summary: "Use the discussion to identify a werewolf.",
    nightInstruction: "You have no night action.",
  },
  {
    id: "hunter",
    name: "Hunter",
    team: "village",
    max: 1,
    increment: 1,
    summary: "If eliminated, also eliminate the player you voted for.",
    nightInstruction: "You have no night action.",
  },
  {
    id: "tanner",
    name: "Tanner",
    team: "tanner",
    max: 1,
    increment: 1,
    summary: "Win by getting yourself eliminated.",
    nightInstruction: "You have no night action.",
  },
] as const satisfies readonly RoleDefinitionShape[];

export type RoleId = (typeof roleDefinitions)[number]["id"];
export type RoleDefinition = (typeof roleDefinitions)[number];

export const roleById = Object.fromEntries(
  roleDefinitions.map((role) => [role.id, role]),
) as Record<RoleId, RoleDefinition>;

export const nightRoleOrder: NightStageRole[] = [
  "doppelganger",
  "werewolf",
  "minion",
  "mason",
  "seer",
  "robber",
  "troublemaker",
  "drunk",
  "insomniac",
];

type NightStageRole = Exclude<RoleId, "villager" | "hunter" | "tanner">;

export const immediateDoppelgangerRoles: RoleId[] = [
  "seer",
  "robber",
  "troublemaker",
  "drunk",
];

export function effectiveRole(card: RoleCard): RoleId {
  if (card.role === "doppelganger") {
    return card.copiedRole ?? "villager";
  }
  return card.role;
}

export function teamForRole(role: RoleId): Team {
  if (role === "werewolf" || role === "minion") return "werewolf";
  if (role === "tanner") return "tanner";
  return "village";
}

const recommendedRoleOrder: RoleId[] = [
  "werewolf",
  "werewolf",
  "seer",
  "robber",
  "troublemaker",
  "villager",
  "villager",
  "villager",
  "minion",
  "drunk",
  "insomniac",
  "hunter",
  "tanner",
];

export function recommendedRoles(playerCount: number): RoleId[] {
  return recommendedRoleOrder.slice(0, playerCount + 3);
}

export function roleName(role: RoleId) {
  return roleById[role].name;
}
