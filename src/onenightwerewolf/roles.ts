import { roleChangingArtifact } from "./artifacts";
import type { ArtifactId, RoleCard, Team } from "./types";

interface RoleDefinition {
  id: string;
  name: string;
  team: Team;
  max: number;
  increment: number;
  setupSummary: string;
  nightSummary: string | null;
  nightInstruction: string;
  doppelgangerFollowUp?: string;
}

export const roleDefinitions = [
  {
    id: "doppelganger",
    name: "Doppelgänger",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Copy another player’s role and team.",
    nightSummary: null,
    nightInstruction:
      "Choose another player’s role to copy. You become that role and may act immediately.",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Shield another player’s role from night actions.",
    nightSummary: null,
    nightInstruction:
      "You may shield any other player’s role. A shielded role cannot be viewed, moved, revealed, or given an artifact.",
  },
  {
    id: "werewolf",
    name: "Werewolf",
    team: "werewolf",
    max: 2,
    increment: 1,
    setupSummary: "Avoid having a werewolf eliminated.",
    nightSummary: "Avoid having a werewolf eliminated.",
    nightInstruction: "See which other players are werewolves.",
    doppelgangerFollowUp:
      "Follow the Werewolf instructions when the narrator calls for them.",
  },
  {
    id: "alpha-wolf",
    name: "Alpha Wolf",
    team: "werewolf",
    max: 1,
    increment: 1,
    setupSummary:
      "Secretly exchange the extra center Werewolf role with another player’s role.",
    nightSummary: "Avoid having a werewolf eliminated.",
    nightInstruction:
      "Exchange the Alpha Wolf center role with another player’s role without viewing either role.",
    doppelgangerFollowUp:
      "Follow the Werewolf instructions when the narrator calls for them.",
  },
  {
    id: "mystic-wolf",
    name: "Mystic Wolf",
    team: "werewolf",
    max: 1,
    increment: 1,
    setupSummary:
      "Meet the other werewolves, then optionally inspect another player’s role.",
    nightSummary: "Avoid having a werewolf eliminated.",
    nightInstruction:
      "After waking with the other werewolves, you may look at one other player’s role.",
    doppelgangerFollowUp:
      "Follow the Werewolf instructions when the narrator calls for them.",
  },
  {
    id: "dream-wolf",
    name: "Dream Wolf",
    team: "werewolf",
    max: 1,
    increment: 1,
    setupSummary:
      "Stay asleep while identifying yourself to the other werewolves.",
    nightSummary: "Avoid having a werewolf eliminated.",
    nightInstruction:
      "Keep your eyes closed when the werewolves wake and identify yourself by extending your thumb.",
    doppelgangerFollowUp:
      "Follow the Werewolf instructions when the narrator calls for them.",
  },
  {
    id: "minion",
    name: "Minion",
    team: "werewolf",
    max: 1,
    increment: 1,
    setupSummary: "Help the werewolves survive, even at your own expense.",
    nightSummary: "Help the werewolves survive, even at your own expense.",
    nightInstruction: "Learn which players began as werewolves.",
    doppelgangerFollowUp: "Wake again when the narrator calls the Minion.",
  },
  {
    id: "mason",
    name: "Mason",
    team: "village",
    max: 2,
    increment: 2,
    setupSummary: "Know who the other Mason is.",
    nightSummary: null,
    nightInstruction: "Find the other player who began as a Mason.",
    doppelgangerFollowUp: "Wake again when the narrator calls the Masons.",
  },
  {
    id: "seer",
    name: "Seer",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Inspect one player role or two center roles.",
    nightSummary: null,
    nightInstruction:
      "You may look at one other player’s role or any two center roles.",
  },
  {
    id: "apprentice-seer",
    name: "Apprentice Seer",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Optionally inspect one center role.",
    nightSummary: null,
    nightInstruction: "You may look at one center role.",
  },
  {
    id: "paranormal-investigator",
    name: "Paranormal Investigator",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary:
      "Inspect up to two players, becoming the first werewolf or Tanner you see.",
    nightSummary:
      "If you see a werewolf or Tanner, you become that role and join its team.",
    nightInstruction:
      "You may look at up to two other players’ roles, one at a time. Stop if you see a werewolf or Tanner.",
  },
  {
    id: "robber",
    name: "Robber",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Trade roles with another player, then see your new role.",
    nightSummary: null,
    nightInstruction:
      "You may swap your role with another player’s role and view the role you received.",
  },
  {
    id: "witch",
    name: "Witch",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary:
      "Inspect a center role, then exchange it with a player’s role.",
    nightSummary: null,
    nightInstruction:
      "You may look at one center role. If you do, you must exchange that role with any player’s role, including your own.",
  },
  {
    id: "troublemaker",
    name: "Troublemaker",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Secretly swap two other players’ roles.",
    nightSummary: null,
    nightInstruction:
      "You may choose two other players and swap their roles without viewing them.",
  },
  {
    id: "village-idiot",
    name: "Village Idiot",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary:
      "Optionally rotate every eligible player’s role except your own.",
    nightSummary: null,
    nightInstruction:
      "You may move every eligible player’s role except your own one place to the left or right without viewing them.",
  },
  {
    id: "drunk",
    name: "Drunk",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Exchange your role with an unseen center role.",
    nightSummary: null,
    nightInstruction:
      "Swap your role with one center role without seeing your new role.",
  },
  {
    id: "insomniac",
    name: "Insomniac",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Check whether your role changed during the night.",
    nightSummary: null,
    nightInstruction: "Look at the role currently in front of you.",
    doppelgangerFollowUp:
      "Pick up this device again after the regular Insomniac turn.",
  },
  {
    id: "revealer",
    name: "Revealer",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary:
      "Reveal another player’s role unless it is a werewolf or Tanner.",
    nightSummary: null,
    nightInstruction:
      "You may reveal another player’s role. If it is a werewolf or Tanner, hide it again.",
    doppelgangerFollowUp:
      "Pick up this device again after the regular Revealer turn.",
  },
  {
    id: "curator",
    name: "Curator",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Optionally give one player a random face-down artifact.",
    nightSummary: null,
    nightInstruction:
      "You may give any unshielded player, including yourself, a random face-down artifact without viewing it.",
    doppelgangerFollowUp:
      "Pick up this device again after the regular Curator turn.",
  },
  {
    id: "villager",
    name: "Villager",
    team: "village",
    max: 3,
    increment: 1,
    setupSummary: "Use the discussion to identify a werewolf.",
    nightSummary: "Use the discussion to identify a werewolf.",
    nightInstruction: "You have no night action.",
  },
  {
    id: "hunter",
    name: "Hunter",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "If eliminated, also eliminate the player you voted for.",
    nightSummary:
      "If you are eliminated, the player you vote for is also eliminated.",
    nightInstruction: "You have no night action.",
  },
  {
    id: "bodyguard",
    name: "Bodyguard",
    team: "village",
    max: 1,
    increment: 1,
    setupSummary: "Protect the player you vote for from elimination.",
    nightSummary: "The player you vote for cannot be eliminated.",
    nightInstruction: "You have no night action.",
  },
  {
    id: "tanner",
    name: "Tanner",
    team: "tanner",
    max: 1,
    increment: 1,
    setupSummary: "Win by getting yourself eliminated.",
    nightSummary: null,
    nightInstruction: "You have no night action.",
  },
] as const satisfies readonly RoleDefinition[];

export type RoleId = (typeof roleDefinitions)[number]["id"];

export const roleById = Object.fromEntries(
  roleDefinitions.map((role) => [role.id, role]),
) as Record<RoleId, RoleDefinition>;

const werewolfRoles = new Set<RoleId>([
  "werewolf",
  "alpha-wolf",
  "mystic-wolf",
  "dream-wolf",
]);

const awakeWerewolfRoles = new Set<RoleId>([
  "werewolf",
  "alpha-wolf",
  "mystic-wolf",
]);

const immediateDoppelgangerRoleIds = [
  "sentinel",
  "alpha-wolf",
  "mystic-wolf",
  "seer",
  "apprentice-seer",
  "paranormal-investigator",
  "robber",
  "witch",
  "troublemaker",
  "village-idiot",
  "drunk",
] as const satisfies readonly RoleId[];

export type ImmediateDoppelgangerRole =
  (typeof immediateDoppelgangerRoleIds)[number];

const immediateDoppelgangerRoles = new Set<RoleId>(
  immediateDoppelgangerRoleIds,
);

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

export const nightStageOrder = [
  "doppelganger",
  "sentinel",
  "werewolf",
  "alpha-wolf",
  "mystic-wolf",
  "minion",
  "mason",
  "seer",
  "apprentice-seer",
  "paranormal-investigator",
  "robber",
  "witch",
  "troublemaker",
  "village-idiot",
  "drunk",
  "insomniac",
  "doppelganger-insomniac",
  "revealer",
  "doppelganger-revealer",
  "curator",
  "doppelganger-curator",
] as const satisfies readonly (
  | RoleId
  | "doppelganger-insomniac"
  | "doppelganger-revealer"
  | "doppelganger-curator"
)[];

export type NightStage = (typeof nightStageOrder)[number];

export function isWerewolfRole(role: RoleId) {
  return werewolfRoles.has(role);
}

export function isAwakeWerewolfRole(role: RoleId) {
  return awakeWerewolfRoles.has(role);
}

export function isImmediateDoppelgangerRole(
  role: RoleId,
): role is ImmediateDoppelgangerRole {
  return immediateDoppelgangerRoles.has(role);
}

export function teamForRole(role: RoleId): Team {
  return roleById[role].team;
}

export function recommendedRoles(playerCount: number): RoleId[] {
  return recommendedRoleOrder.slice(0, playerCount + 3);
}

export function buildNightStages(roles: readonly RoleId[]): NightStage[] {
  return nightStageOrder.filter((stage) => {
    switch (stage) {
      case "werewolf":
        return roles.some(isWerewolfRole);
      case "doppelganger-insomniac":
        return roles.includes("doppelganger") && roles.includes("insomniac");
      case "doppelganger-revealer":
        return roles.includes("doppelganger") && roles.includes("revealer");
      case "doppelganger-curator":
        return roles.includes("doppelganger") && roles.includes("curator");
      default:
        return roles.includes(stage);
    }
  });
}

export function effectiveRole(
  card: RoleCard,
  artifact: ArtifactId | null = null,
): RoleId {
  const artifactRole = roleChangingArtifact(artifact);
  if (artifactRole) return artifactRole;
  if (card.role === "doppelganger") {
    if (card.transformedRole) return card.transformedRole;
    return card.copiedRole ?? "villager";
  }
  if (card.role === "paranormal-investigator" && card.transformedRole) {
    return card.transformedRole;
  }
  return card.role;
}

export function roleName(role: RoleId) {
  return roleById[role].name;
}
