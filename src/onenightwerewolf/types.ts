import type { ArtifactId } from "./artifacts";
import type { NightStage, RoleId } from "./roles";

export type { ArtifactId } from "./artifacts";
export type { RoleId } from "./roles";

export type Team = "village" | "werewolf" | "tanner";

export type RoleCard =
  | {
      id: string;
      role: "doppelganger";
      copiedRole?: RoleId;
      transformedRole?: "werewolf" | "tanner";
    }
  | {
      id: string;
      role: "paranormal-investigator";
      transformedRole?: "werewolf" | "tanner";
    }
  | {
      id: string;
      role: Exclude<RoleId, "doppelganger" | "paranormal-investigator">;
    };

export interface Player {
  name: string;
  initialRole: RoleId | null;
  card: RoleCard | null;
  shielded: boolean;
  faceUp: boolean;
  artifact: ArtifactId | null;
}

export type PlayerIndex = number;

export type RevealState = {
  step: "handoff" | "reveal";
  playerIndex: PlayerIndex;
};

export type VotingState =
  | {
      step: "handoff";
      voterIndex: PlayerIndex;
      votes: PlayerIndex[];
    }
  | {
      step: "choosing";
      voterIndex: PlayerIndex;
      pendingVote: PlayerIndex | null;
      votes: PlayerIndex[];
    };

export type CenterSlot = "left" | "middle" | "right" | "alpha-wolf";

export interface CenterCard {
  id: string;
  slot: CenterSlot;
  card: RoleCard;
}

export type RotationDirection = "clockwise" | "counterclockwise";

export type NightReveal =
  | {
      kind: "player";
      playerIndex: PlayerIndex;
      playerName: string;
      role: RoleId;
      visibility: "private" | "public";
    }
  | {
      kind: "center";
      centerSlot: CenterSlot;
      role: RoleId;
    }
  | {
      kind: "copied-role" | "new-role" | "current-role";
      role: RoleId;
    };

export type NightActionRole =
  | "doppelganger"
  | "sentinel"
  | "werewolf"
  | "alpha-wolf"
  | "mystic-wolf"
  | "minion"
  | "mason"
  | "seer"
  | "apprentice-seer"
  | "paranormal-investigator"
  | "robber"
  | "witch"
  | "troublemaker"
  | "village-idiot"
  | "drunk"
  | "insomniac"
  | "revealer"
  | "curator";

export interface NightInvocation<
  Role extends NightActionRole = NightActionRole,
> {
  stageIndex: number;
  role: Role;
  actorIndex: PlayerIndex;
  actorIndexes: PlayerIndex[];
  isDoppelgangerCopy: boolean;
}

export type NightState =
  | { step: "intro" }
  | { step: "calling"; invocation: NightInvocation }
  | { step: "acting"; invocation: NightInvocation }
  | { step: "complete" };

export interface VoteCount {
  playerIndex: PlayerIndex;
  name: string;
  count: number;
  voters: string[];
}

export interface PlayerOutcome {
  playerIndex: PlayerIndex;
  name: string;
  initialRole: RoleId;
  finalRole: RoleId;
  team: Team;
  won: boolean;
  artifact: ArtifactId | null;
  protected: boolean;
  eliminated: boolean;
}

export interface GameResult {
  eliminatedPlayerIndexes: PlayerIndex[];
  voteCounts: VoteCount[];
  winningTeams: Team[];
  hadPlayerWerewolf: boolean;
  playerOutcomes: PlayerOutcome[];
  votesRecorded: boolean;
}

export type GameState =
  | { phase: "setup" }
  | { phase: "roles"; role: RevealState }
  | { phase: "night"; night: NightState; stages: NightStage[] }
  | { phase: "artifacts"; artifact: RevealState }
  | { phase: "discussion" }
  | { phase: "voting"; voting: VotingState }
  | { phase: "reveal"; result: GameResult };

export type GamePhase = GameState["phase"];
