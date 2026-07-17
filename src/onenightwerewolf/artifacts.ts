import type { RoleId } from "./roles";

interface ArtifactDefinitionShape {
  id: string;
  name: string;
  instruction: string;
  roleOverride: RoleId | null;
}

export const artifactDefinitions = [
  {
    id: "claw",
    name: "Claw of the Werewolf",
    instruction: "You are now a Werewolf.",
    roleOverride: "werewolf",
  },
  {
    id: "brand",
    name: "Brand of the Villager",
    instruction:
      "You are now a Villager with no special ability or previous win condition.",
    roleOverride: "villager",
  },
  {
    id: "cudgel",
    name: "Cudgel of the Tanner",
    instruction: "You are now a Tanner and win only if you are eliminated.",
    roleOverride: "tanner",
  },
  {
    id: "void",
    name: "Void of Nothingness",
    instruction: "This artifact has no effect.",
    roleOverride: null,
  },
  {
    id: "mask",
    name: "Mask of Muting",
    instruction:
      "You may not speak. You may communicate silently with gestures or sign language.",
    roleOverride: null,
  },
  {
    id: "shroud",
    name: "Shroud of Shame",
    instruction:
      "Turn away from the group. You may speak, but do not look at players, roles, or tokens.",
    roleOverride: null,
  },
] as const satisfies readonly ArtifactDefinitionShape[];

export type ArtifactId = (typeof artifactDefinitions)[number]["id"];
export type ArtifactDefinition = (typeof artifactDefinitions)[number];

export const artifactById = Object.fromEntries(
  artifactDefinitions.map((artifact) => [artifact.id, artifact]),
) as Record<ArtifactId, ArtifactDefinition>;

export const artifactIds = artifactDefinitions.map(
  (artifact) => artifact.id,
) as ArtifactId[];

export function roleChangingArtifact(
  artifact: ArtifactId | null,
): RoleId | null {
  return artifact ? artifactById[artifact].roleOverride : null;
}
