import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { builtInDictionaries, type Dictionary } from "../dictionary";
import {
  GamePhase,
  PlayerOrder,
  type Player,
  type PlayerIndex,
  type RoundResult,
  type VoteCount,
  type Winner,
} from "../types";

export const SKIP_VOTE = "__skip__" as const;

const initialPlayers: Player[] = Array.from({ length: 3 }, () => ({
  name: "",
  active: true,
  isImposter: false,
}));

function useGameState() {
  const [phase, setPhase] = useState(GamePhase.Setup);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [playerOrderIndexes, setPlayerOrderIndexes] = useState<PlayerIndex[]>(
    [],
  );
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customTheme, setCustomTheme] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [imposterCount, setImposterCount] = useState(1);
  const [playerOrder, setPlayerOrder] = useState(PlayerOrder.RandomStart);
  const [showThemeHint, setShowThemeHint] = useState(false);
  const [allowAbstaining, setAllowAbstaining] = useState(false);
  const [impostersKnowEachOther, setImpostersKnowEachOther] = useState(false);
  const [secretWord, setSecretWord] = useState("");
  const [activeTheme, setActiveTheme] = useState("");
  const [roundNumber, setRoundNumber] = useState(1);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(false);
  const [clueIndex, setClueIndex] = useState(0);
  const [currentClue, setCurrentClue] = useState("");
  const [clues, setClues] = useState<string[][]>([]);
  const [voteIndex, setVoteIndex] = useState(0);
  const [pendingVote, setPendingVote] = useState<
    PlayerIndex | typeof SKIP_VOTE | null
  >(null);
  const [votes, setVotes] = useState<
    (PlayerIndex | typeof SKIP_VOTE | undefined)[]
  >([]);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  const playerIndexes = players.map((_player, playerIndex) => playerIndex);
  const activePlayerIndexes = (
    playerOrderIndexes.length > 0 ? playerOrderIndexes : playerIndexes
  ).filter((playerIndex) => players[playerIndex]?.active);
  const votingPlayerIndexes = playerIndexes.filter(
    (playerIndex) => players[playerIndex].active,
  );

  const playerNames = players.map((player) => player.name.trim());
  const maxImposters = Math.max(1, Math.floor((playerNames.length - 1) / 2));
  const parsedCustomWords = customWords
    .split(/[\n,]/)
    .map((word) => word.trim())
    .filter(Boolean);

  const selectedDictionaries: Dictionary[] = builtInDictionaries.filter(
    (dictionary) => selectedThemes.includes(dictionary.theme),
  );

  if (selectedThemes.includes("Custom") && parsedCustomWords.length > 0) {
    selectedDictionaries.push({
      theme: customTheme.trim() || "Custom",
      words: parsedCustomWords,
    });
  }

  const setupProblem = (() => {
    const uniqueNames = new Set(playerNames.map((name) => name.toLowerCase()));

    if (players.some((player) => !player.name.trim())) {
      return "Every player needs a name.";
    }
    if (playerNames.length < 3) {
      return "Imposter needs at least 3 players.";
    }
    if (uniqueNames.size !== playerNames.length) {
      return "Player names must be unique.";
    }
    if (imposterCount < 1 || imposterCount > maxImposters) {
      return `Choose 1 to ${maxImposters} imposters for this group.`;
    }
    if (selectedThemes.length === 0) {
      return "Choose at least one word theme.";
    }
    if (
      selectedThemes.includes("Custom") &&
      showThemeHint &&
      !customTheme.trim()
    ) {
      return "Add a custom theme hint.";
    }
    if (selectedThemes.includes("Custom") && parsedCustomWords.length === 0) {
      return "Add at least one custom secret word.";
    }
    if (selectedDictionaries.length === 0) {
      return "Choose at least one word theme.";
    }
    return "";
  })();

  const currentRolePlayer = players[roleIndex];
  const currentCluePlayerIndex = activePlayerIndexes[clueIndex];
  const currentCluePlayer = players[currentCluePlayerIndex];
  const currentVotePlayerIndex = votingPlayerIndexes[voteIndex];
  const currentVotePlayer = players[currentVotePlayerIndex];
  const clueContainsSecret = Boolean(
    secretWord &&
    !currentCluePlayer?.isImposter &&
    currentClue.trim().toLowerCase().includes(secretWord.toLowerCase()),
  );

  useEffect(() => {
    setImposterCount((count) => Math.min(Math.max(1, count), maxImposters));
  }, [maxImposters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, roleIndex, clueIndex, voteIndex]);

  const addPlayer = () => {
    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        name: "",
        active: true,
        isImposter: false,
      },
    ]);
  };

  const removePlayer = (playerIndex: PlayerIndex) => {
    if (players.length <= 3) return;
    setPlayers((currentPlayers) =>
      currentPlayers.filter((_player, index) => index !== playerIndex),
    );
  };

  const updatePlayerName = (playerIndex: PlayerIndex, name: string) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) =>
        index === playerIndex ? { ...player, name } : player,
      ),
    );
  };

  const startGame = () => {
    if (setupProblem) return;

    const imposterIndexes = new Set<number>();
    while (imposterIndexes.size < imposterCount) {
      imposterIndexes.add(Math.floor(Math.random() * playerNames.length));
    }

    const gamePlayers = playerNames.map((name, index) => ({
      name,
      active: true,
      isImposter: imposterIndexes.has(index),
    }));

    let order = gamePlayers.map((_player, playerIndex) => playerIndex);
    if (playerOrder === PlayerOrder.RandomStart) {
      const startIndex = Math.floor(Math.random() * order.length);
      order = [...order.slice(startIndex), ...order.slice(0, startIndex)];
    } else if (playerOrder === PlayerOrder.Random) {
      for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
      }
    }

    const dictionary =
      selectedDictionaries[
        Math.floor(Math.random() * selectedDictionaries.length)
      ];
    const word =
      dictionary.words[Math.floor(Math.random() * dictionary.words.length)];

    setPlayers(gamePlayers);
    setPlayerOrderIndexes(order);
    setSecretWord(word);
    setActiveTheme(dictionary.theme);
    setRoundNumber(1);
    setRoleIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setCurrentClue("");
    setClues([]);
    setVoteIndex(0);
    setPendingVote(null);
    setVotes([]);
    setRoundResult(null);
    setPhase(GamePhase.Roles);
  };

  const hideRoleAndPass = () => {
    setRoleVisible(false);
    if (roleIndex + 1 >= players.length) {
      setPhase(GamePhase.Clues);
    } else {
      setRoleIndex(roleIndex + 1);
    }
  };

  const revealRole = () => setRoleVisible(true);

  const submitClue = () => {
    if (!currentCluePlayer || !currentClue.trim()) return;

    setClues((currentClues) => {
      const nextClues = [...currentClues];
      const playerClues = [...(nextClues[currentCluePlayerIndex] ?? [])];
      playerClues[roundNumber - 1] = currentClue.trim();
      nextClues[currentCluePlayerIndex] = playerClues;
      return nextClues;
    });
    setCurrentClue("");

    if (clueIndex + 1 >= activePlayerIndexes.length) {
      setPhase(GamePhase.Discussion);
    } else {
      setClueIndex(clueIndex + 1);
    }
  };

  const startVoting = () => {
    setVoteIndex(0);
    setPendingVote(null);
    setVotes([]);
    setPhase(GamePhase.Voting);
  };

  const submitVote = () => {
    if (!currentVotePlayer || pendingVote === null) return;

    const submittedVotes = [...votes];
    submittedVotes[currentVotePlayerIndex] = pendingVote;
    const nextVoteIndex = voteIndex + 1;
    setPendingVote(null);

    if (nextVoteIndex < votingPlayerIndexes.length) {
      setVotes(submittedVotes);
      setVoteIndex(nextVoteIndex);
      return;
    }

    const votersByCandidate = new Map<PlayerIndex, PlayerIndex[]>();
    votingPlayerIndexes.forEach((voterIndex) => {
      const candidateIndex = submittedVotes[voterIndex];
      if (candidateIndex !== undefined && candidateIndex !== SKIP_VOTE) {
        votersByCandidate.set(candidateIndex, [
          ...(votersByCandidate.get(candidateIndex) ?? []),
          voterIndex,
        ]);
      }
    });

    const skippedVoters = votingPlayerIndexes
      .filter((voterIndex) => submittedVotes[voterIndex] === SKIP_VOTE)
      .map((voterIndex) => players[voterIndex].name);

    const voteCounts: VoteCount[] = votingPlayerIndexes
      .map((playerIndex) => {
        const player = players[playerIndex];
        return {
          playerIndex,
          name: player.name,
          count: votersByCandidate.get(playerIndex)?.length ?? 0,
          voters:
            votersByCandidate
              .get(playerIndex)
              ?.map((voterIndex) => players[voterIndex].name) ?? [],
        };
      })
      .sort(
        (first, second) =>
          second.count - first.count || first.name.localeCompare(second.name),
      );

    const highestVoteCount = voteCounts[0]?.count ?? 0;
    const tiedCandidates = voteCounts.filter(
      (entry) => entry.count === highestVoteCount,
    );
    const isTie = highestVoteCount === 0 || tiedCandidates.length !== 1;
    const eliminatedPlayerIndex = isTie ? null : tiedCandidates[0].playerIndex;
    const remainingPlayerIndexes =
      eliminatedPlayerIndex === null
        ? votingPlayerIndexes
        : votingPlayerIndexes.filter(
            (playerIndex) => playerIndex !== eliminatedPlayerIndex,
          );
    const remainingImposters = remainingPlayerIndexes.filter(
      (playerIndex) => players[playerIndex].isImposter,
    ).length;
    const remainingCivilians =
      remainingPlayerIndexes.length - remainingImposters;

    let winner: Winner = null;
    if (isTie) winner = "tie";
    else if (remainingImposters === 0) winner = "civilians";
    else if (remainingImposters >= remainingCivilians) winner = "imposters";

    if (eliminatedPlayerIndex !== null) {
      setPlayers((currentPlayers) =>
        currentPlayers.map((player, playerIndex) =>
          playerIndex === eliminatedPlayerIndex
            ? { ...player, active: false }
            : player,
        ),
      );
    }

    setRoundResult({
      eliminatedPlayerIndex,
      winner,
      voteCounts,
      skippedVoters,
    });
    setPhase(GamePhase.Reveal);
  };

  const continueGame = () => {
    setRoundNumber((number) => number + 1);
    setClueIndex(0);
    setCurrentClue("");
    setVoteIndex(0);
    setPendingVote(null);
    setVotes([]);
    setRoundResult(null);
    setPhase(GamePhase.Clues);
  };

  const resetGame = () => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        name: player.name,
        active: true,
        isImposter: false,
      })),
    );
    setPlayerOrderIndexes([]);
    setSecretWord("");
    setActiveTheme("");
    setRoundNumber(1);
    setRoleIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setCurrentClue("");
    setClues([]);
    setVoteIndex(0);
    setPendingVote(null);
    setVotes([]);
    setRoundResult(null);
    setPhase(GamePhase.Setup);
  };

  return {
    activePlayerIndexes,
    activeTheme,
    addPlayer,
    allowAbstaining,
    clueContainsSecret,
    clueIndex,
    clues,
    continueGame,
    currentClue,
    currentCluePlayer,
    currentRolePlayer,
    currentVotePlayer,
    currentVotePlayerIndex,
    customTheme,
    customWords,
    hideRoleAndPass,
    imposterCount,
    impostersKnowEachOther,
    maxImposters,
    pendingVote,
    phase,
    playerCount: playerNames.length,
    playerOrder,
    players,
    removePlayer,
    resetGame,
    revealRole,
    roleIndex,
    roleVisible,
    roundNumber,
    roundResult,
    secretWord,
    selectedThemes,
    setAllowAbstaining,
    setCurrentClue,
    setCustomTheme,
    setCustomWords,
    setImposterCount,
    setImpostersKnowEachOther,
    setPendingVote,
    setPlayerOrder,
    setSelectedThemes,
    setShowThemeHint,
    showThemeHint,
    setupProblem,
    startGame,
    startVoting,
    submitClue,
    submitVote,
    updatePlayerName,
    voteIndex,
    votingPlayerIndexes,
  };
}

export type Game = ReturnType<typeof useGameState>;

const GameContext = createContext<Game | null>(null);

export function GameProvider({ children }: { children: ComponentChildren }) {
  const game = useGameState();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGame() {
  const game = useContext(GameContext);
  if (!game) throw new Error("useGame must be used within GameProvider.");
  return game;
}
