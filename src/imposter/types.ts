export enum GamePhase {
  Setup = "setup",
  Roles = "roles",
  Clues = "clues",
  Discussion = "discussion",
  Voting = "voting",
  Reveal = "reveal",
}

export enum PlayerOrder {
  Fixed = "fixed",
  RandomStart = "random-start",
  Random = "random",
}

export interface Player {
  id: string;
  name: string;
  active: boolean;
  isImposter: boolean;
}

export interface VoteCount {
  playerId: string;
  name: string;
  count: number;
  voters: string[];
}

export type Winner = "civilians" | "imposters" | "tie" | null;

export interface RoundResult {
  eliminated: Player | null;
  winner: Winner;
  voteCounts: VoteCount[];
  skippedVoters: string[];
}
