import type { RoleId } from "./roles";

export type { RoleId } from "./roles";

export enum GamePhase {
  Setup = "setup",
  Roles = "roles",
  Night = "night",
  Discussion = "discussion",
  Voting = "voting",
  Reveal = "reveal",
}

export type Team = "village" | "werewolf" | "tanner";

export interface RoleCard {
  id: string;
  role: RoleId;
  copiedRole?: RoleId;
}

export interface Player {
  id: string;
  name: string;
  initialRole: RoleId | null;
  card: RoleCard | null;
}

export interface CenterCard {
  id: string;
  label: string;
  card: RoleCard;
}

export type NightStage = RoleId | "doppelganger-insomniac";

export type NightStep = "intro" | "calling" | "acting" | "result" | "complete";

export interface NightReveal {
  label: string;
  role: RoleId;
}

export interface VoteCount {
  playerId: string;
  name: string;
  count: number;
  voters: string[];
}

export interface GameResult {
  eliminatedIds: string[];
  voteCounts: VoteCount[];
  winningTeams: Team[];
  hadPlayerWerewolf: boolean;
}
