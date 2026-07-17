import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { useScreenWakeLock } from "../../common/hooks/useScreenWakeLock";
import { builtInDictionaries, type Dictionary } from "../dictionary";
import {
  GamePhase,
  PlayerOrder,
  type Player,
  type RoundResult,
  type VoteCount,
  type Winner,
} from "../types";

export const SKIP_VOTE = "__skip__";

const initialPlayers: Player[] = Array.from({ length: 3 }, (_, index) => ({
  id: `player-${index + 1}`,
  name: "",
  active: true,
  isImposter: false,
}));

function useGameState() {
  const { releaseWakeLock, requestWakeLock } = useScreenWakeLock();
  const [phase, setPhase] = useState(GamePhase.Setup);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [playerOrderIds, setPlayerOrderIds] = useState<string[]>([]);
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
  const [clues, setClues] = useState<Record<string, string[]>>({});
  const [voteIndex, setVoteIndex] = useState(0);
  const [pendingVote, setPendingVote] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  const activePlayers = (
    playerOrderIds.length > 0
      ? playerOrderIds
          .map((id) => players.find((player) => player.id === id))
          .filter((player): player is Player => Boolean(player))
      : players
  ).filter((player) => player.active);

  const votingPlayers = players.filter((player) => player.active);

  const setupPlayers = [...players];
  while (
    setupPlayers.length > 0 &&
    !setupPlayers[setupPlayers.length - 1].name.trim()
  ) {
    setupPlayers.pop();
  }

  const playerNames = setupPlayers.map((player) => player.name.trim());
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

    if (setupPlayers.some((player) => !player.name.trim())) {
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
  const currentCluePlayer = activePlayers[clueIndex];
  const currentVotePlayer = votingPlayers[voteIndex];
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
        id: `player-${Date.now()}`,
        name: "",
        active: true,
        isImposter: false,
      },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== id),
    );
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === id ? { ...player, name } : player,
      ),
    );
  };

  const startGame = () => {
    if (setupProblem) return;

    void requestWakeLock();

    const imposterIndexes = new Set<number>();
    while (imposterIndexes.size < imposterCount) {
      imposterIndexes.add(Math.floor(Math.random() * playerNames.length));
    }

    const timestamp = Date.now();
    const gamePlayers = playerNames.map((name, index) => ({
      id: `player-${index + 1}-${timestamp}`,
      name,
      active: true,
      isImposter: imposterIndexes.has(index),
    }));

    let order = gamePlayers.map((player) => player.id);
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
    setPlayerOrderIds(order);
    setSecretWord(word);
    setActiveTheme(dictionary.theme);
    setRoundNumber(1);
    setRoleIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setCurrentClue("");
    setClues({});
    setVoteIndex(0);
    setPendingVote("");
    setVotes({});
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
      const playerClues = [...(currentClues[currentCluePlayer.id] ?? [])];
      playerClues[roundNumber - 1] = currentClue.trim();
      return { ...currentClues, [currentCluePlayer.id]: playerClues };
    });
    setCurrentClue("");

    if (clueIndex + 1 >= activePlayers.length) {
      setPhase(GamePhase.Discussion);
    } else {
      setClueIndex(clueIndex + 1);
    }
  };

  const startVoting = () => {
    setVoteIndex(0);
    setPendingVote("");
    setVotes({});
    setPhase(GamePhase.Voting);
  };

  const submitVote = () => {
    if (!currentVotePlayer || !pendingVote) return;

    const submittedVotes = { ...votes, [currentVotePlayer.id]: pendingVote };
    const nextVoteIndex = voteIndex + 1;
    setPendingVote("");

    if (nextVoteIndex < votingPlayers.length) {
      setVotes(submittedVotes);
      setVoteIndex(nextVoteIndex);
      return;
    }

    const votersByCandidate = new Map<string, string[]>();
    Object.entries(submittedVotes).forEach(([voterId, candidateId]) => {
      if (candidateId !== SKIP_VOTE) {
        votersByCandidate.set(candidateId, [
          ...(votersByCandidate.get(candidateId) ?? []),
          voterId,
        ]);
      }
    });

    const skippedVoters = Object.entries(submittedVotes)
      .filter(([, candidateId]) => candidateId === SKIP_VOTE)
      .map(([voterId]) => players.find((player) => player.id === voterId)?.name)
      .filter((name): name is string => Boolean(name));

    const voteCounts: VoteCount[] = votingPlayers
      .map((player) => ({
        playerId: player.id,
        name: player.name,
        count: votersByCandidate.get(player.id)?.length ?? 0,
        voters:
          votersByCandidate
            .get(player.id)
            ?.map(
              (voterId) =>
                players.find((player) => player.id === voterId)?.name,
            )
            .filter((name): name is string => Boolean(name)) ?? [],
      }))
      .sort(
        (first, second) =>
          second.count - first.count || first.name.localeCompare(second.name),
      );

    const highestVoteCount = voteCounts[0]?.count ?? 0;
    const tiedCandidates = voteCounts.filter(
      (entry) => entry.count === highestVoteCount,
    );
    const isTie = highestVoteCount === 0 || tiedCandidates.length !== 1;
    const eliminated = isTie
      ? null
      : (votingPlayers.find(
          (player) => player.id === tiedCandidates[0].playerId,
        ) ?? null);
    const remainingPlayers = eliminated
      ? votingPlayers.filter((player) => player.id !== eliminated.id)
      : votingPlayers;
    const remainingImposters = remainingPlayers.filter(
      (player) => player.isImposter,
    ).length;
    const remainingCivilians = remainingPlayers.length - remainingImposters;

    let winner: Winner = null;
    if (isTie) winner = "tie";
    else if (remainingImposters === 0) winner = "civilians";
    else if (remainingImposters >= remainingCivilians) winner = "imposters";

    if (winner === "civilians" || winner === "imposters") {
      void releaseWakeLock();
    }

    if (eliminated) {
      setPlayers((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === eliminated.id ? { ...player, active: false } : player,
        ),
      );
    }

    setRoundResult({ eliminated, winner, voteCounts, skippedVoters });
    setPhase(GamePhase.Reveal);
  };

  const continueGame = () => {
    setRoundNumber((number) => number + 1);
    setClueIndex(0);
    setCurrentClue("");
    setVoteIndex(0);
    setPendingVote("");
    setVotes({});
    setRoundResult(null);
    setPhase(GamePhase.Clues);
  };

  const resetGame = () => {
    void releaseWakeLock();
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) => ({
        id: `player-${index + 1}`,
        name: player.name,
        active: true,
        isImposter: false,
      })),
    );
    setPlayerOrderIds([]);
    setSecretWord("");
    setActiveTheme("");
    setRoundNumber(1);
    setRoleIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setCurrentClue("");
    setClues({});
    setVoteIndex(0);
    setPendingVote("");
    setVotes({});
    setRoundResult(null);
    setPhase(GamePhase.Setup);
  };

  return {
    activePlayers,
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
    votingPlayers,
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
