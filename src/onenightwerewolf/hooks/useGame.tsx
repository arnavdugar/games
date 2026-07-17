import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { useScreenWakeLock } from "../../common/hooks/useScreenWakeLock";
import {
  effectiveRole,
  immediateDoppelgangerRoles,
  nightRoleOrder,
  recommendedRoles,
  roleById,
} from "../roles";
import {
  GamePhase,
  type CenterCard,
  type GameResult,
  type NightReveal,
  type NightStage,
  type NightStep,
  type Player,
  type RoleCard,
  type RoleId,
  type Team,
  type VoteCount,
} from "../types";

const initialPlayers: Player[] = Array.from({ length: 3 }, (_, index) => ({
  id: `player-${index + 1}`,
  name: "",
  initialRole: null,
  card: null,
}));

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function useGameState() {
  const { releaseWakeLock, requestWakeLock } = useScreenWakeLock();
  const [phase, setPhase] = useState(GamePhase.Setup);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>(
    recommendedRoles(3),
  );
  const [rolesCustomized, setRolesCustomized] = useState(false);
  const [centerCards, setCenterCards] = useState<CenterCard[]>([]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(false);
  const [nightStages, setNightStages] = useState<NightStage[]>([]);
  const [nightStageIndex, setNightStageIndex] = useState(0);
  const [nightStep, setNightStep] = useState<NightStep>("intro");
  const [nightSelections, setNightSelections] = useState<string[]>([]);
  const [seerRevealTarget, setSeerRevealTarget] = useState<"player" | "center">(
    "player",
  );
  const [nightMessage, setNightMessage] = useState("");
  const [nightReveals, setNightReveals] = useState<NightReveal[]>([]);
  const [doppelgangerPlayerId, setDoppelgangerPlayerId] = useState("");
  const [doppelgangerCopiedRole, setDoppelgangerCopiedRole] =
    useState<RoleId | null>(null);
  const [voteIndex, setVoteIndex] = useState(0);
  const [voteVisible, setVoteVisible] = useState(false);
  const [pendingVote, setPendingVote] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GameResult | null>(null);

  const playerNames = players.map((player) => player.name.trim());
  const requiredRoleCount = players.length + 3;
  const roleCounts = selectedRoles.reduce<Partial<Record<RoleId, number>>>(
    (counts, role) => ({ ...counts, [role]: (counts[role] ?? 0) + 1 }),
    {},
  );

  const setupProblem = (() => {
    if (players.some((player) => !player.name.trim())) {
      return "Every player needs a name.";
    }
    if (players.length < 3 || players.length > 10) {
      return "One Night Werewolf needs 3 to 10 players.";
    }
    const uniqueNames = new Set(playerNames.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== playerNames.length) {
      return "Player names must be unique.";
    }
    if (selectedRoles.length !== requiredRoleCount) {
      return `Choose exactly ${requiredRoleCount} roles: one per player plus three center roles.`;
    }
    if (!selectedRoles.includes("werewolf")) {
      return "Include at least one Werewolf role.";
    }
    return "";
  })();

  const currentRolePlayer = players[roleIndex];
  const currentVotePlayer = players[voteIndex];
  const currentNightStage = nightStages[nightStageIndex];

  const nightActorIds = useMemo(() => {
    if (!currentNightStage) return [];
    if (currentNightStage === "doppelganger-insomniac") {
      return doppelgangerCopiedRole === "insomniac" && doppelgangerPlayerId
        ? [doppelgangerPlayerId]
        : [];
    }
    const actors = players
      .filter((player) => player.initialRole === currentNightStage)
      .map((player) => player.id);
    if (
      (currentNightStage === "werewolf" || currentNightStage === "mason") &&
      doppelgangerCopiedRole === currentNightStage &&
      doppelgangerPlayerId
    ) {
      actors.push(doppelgangerPlayerId);
    }
    return actors;
  }, [
    currentNightStage,
    doppelgangerCopiedRole,
    doppelgangerPlayerId,
    players,
  ]);

  const nightActionActorId =
    currentNightStage === "doppelganger" ||
    currentNightStage === "doppelganger-insomniac"
      ? doppelgangerPlayerId
      : (nightActorIds[0] ?? "");

  const nightActionRole: RoleId | null = (() => {
    if (!currentNightStage) return null;
    if (currentNightStage === "doppelganger-insomniac") return "insomniac";
    if (
      currentNightStage === "doppelganger" &&
      doppelgangerCopiedRole &&
      immediateDoppelgangerRoles.includes(doppelgangerCopiedRole)
    ) {
      return doppelgangerCopiedRole;
    }
    return currentNightStage;
  })();

  const wolfActorIds = players
    .filter((player) => player.initialRole === "werewolf")
    .map((player) => player.id);
  if (
    doppelgangerCopiedRole === "werewolf" &&
    doppelgangerPlayerId &&
    !wolfActorIds.includes(doppelgangerPlayerId)
  ) {
    wolfActorIds.push(doppelgangerPlayerId);
  }

  useEffect(() => {
    if (rolesCustomized) return;
    setSelectedRoles(recommendedRoles(players.length));
  }, [players.length, rolesCustomized]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, roleIndex, nightStageIndex, nightStep, voteIndex, voteVisible]);

  useEffect(() => {
    if (
      phase !== GamePhase.Night ||
      nightStep !== "calling" ||
      !currentNightStage ||
      nightActorIds.length > 0
    ) {
      return;
    }

    if (nightStageIndex + 1 >= nightStages.length) {
      setNightStep("complete");
      return;
    }
    setNightStageIndex((index) => index + 1);
  }, [
    currentNightStage,
    nightActorIds.length,
    nightStageIndex,
    nightStages.length,
    nightStep,
    phase,
  ]);

  const addPlayer = () => {
    if (players.length >= 10) return;
    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        id: `player-${Date.now()}`,
        name: "",
        initialRole: null,
        card: null,
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

  const addRole = (role: RoleId) => {
    const definition = roleById[role];
    if ((roleCounts[role] ?? 0) + definition.increment > definition.max) return;
    setRolesCustomized(true);
    setSelectedRoles((roles) => [
      ...roles,
      ...Array.from({ length: definition.increment }, () => role),
    ]);
  };

  const removeRole = (role: RoleId) => {
    if ((roleCounts[role] ?? 0) === 0) return;
    setRolesCustomized(true);
    setSelectedRoles((roles) => {
      let remaining: number = roleById[role].increment;
      return roles.filter((selectedRole) => {
        if (selectedRole !== role || remaining === 0) return true;
        remaining -= 1;
        return false;
      });
    });
  };

  const useRecommendedRoles = () => {
    setSelectedRoles(recommendedRoles(players.length));
    setRolesCustomized(false);
  };

  const buildNightStages = (roles: RoleId[]) => {
    const stages: NightStage[] = nightRoleOrder.filter((role) =>
      roles.includes(role),
    );
    if (roles.includes("doppelganger") && roles.includes("insomniac")) {
      stages.push("doppelganger-insomniac");
    }
    return stages;
  };

  const startGame = () => {
    if (setupProblem) return;
    void requestWakeLock();

    const timestamp = Date.now();
    const cards = shuffle(
      selectedRoles.map<RoleCard>((role, index) => ({
        id: `card-${timestamp}-${index}`,
        role,
      })),
    );
    const assignedPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim(),
      initialRole: cards[index].role,
      card: cards[index],
    }));
    const assignedCenter = cards.slice(players.length).map((card, index) => ({
      id: `center-${index + 1}`,
      label: `Center ${index + 1}`,
      card,
    }));
    const doppelganger = assignedPlayers.find(
      (player) => player.initialRole === "doppelganger",
    );

    setPlayers(assignedPlayers);
    setCenterCards(assignedCenter);
    setRoleIndex(0);
    setRoleVisible(false);
    setNightStages(buildNightStages(selectedRoles));
    setNightStageIndex(0);
    setNightStep("intro");
    setNightSelections([]);
    setSeerRevealTarget("player");
    setNightMessage("");
    setNightReveals([]);
    setDoppelgangerPlayerId(doppelganger?.id ?? "");
    setDoppelgangerCopiedRole(null);
    setVoteIndex(0);
    setVoteVisible(false);
    setPendingVote("");
    setVotes({});
    setResult(null);
    setPhase(GamePhase.Roles);
  };

  const revealRole = () => setRoleVisible(true);

  const hideRoleAndPass = () => {
    setRoleVisible(false);
    if (roleIndex + 1 >= players.length) {
      setPhase(GamePhase.Night);
    } else {
      setRoleIndex((index) => index + 1);
    }
  };

  const beginNight = () => {
    setNightStageIndex(0);
    setNightStep("calling");
  };

  const claimNightTurn = () => {
    if (nightStep === "complete") {
      setPhase(GamePhase.Discussion);
      return;
    }
    setNightSelections([]);
    setSeerRevealTarget("player");
    setNightMessage("");
    setNightReveals([]);
    setNightStep("acting");
  };

  const toggleNightSelection = (id: string, maximum: number) => {
    setNightSelections((selections) => {
      if (selections.includes(id)) {
        return selections.filter((selection) => selection !== id);
      }
      if (maximum === 1) return [id];
      if (selections.length >= maximum) return selections;
      return [...selections, id];
    });
  };

  const updateDoppelgangerCard = (copiedRole: RoleId) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== doppelgangerPlayerId || !player.card) return player;
        return {
          ...player,
          card: { ...player.card, copiedRole },
        };
      }),
    );
  };

  const copyDoppelgangerRole = () => {
    const target = players.find((player) => player.id === nightSelections[0]);
    if (!target?.card) return;
    const copiedRole = effectiveRole(target.card);
    setDoppelgangerCopiedRole(copiedRole);
    updateDoppelgangerCard(copiedRole);
    setNightSelections([]);
    setNightMessage(
      `You copied ${target.name}'s ${roleById[copiedRole].name} role.`,
    );

    if (immediateDoppelgangerRoles.includes(copiedRole)) return;

    if (copiedRole === "minion") {
      const wolves = players.filter(
        (player) => player.initialRole === "werewolf",
      );
      setNightMessage(
        wolves.length > 0
          ? `You copied the Minion. The werewolves are ${wolves.map((wolf) => wolf.name).join(" and ")}.`
          : "You copied the Minion. No player began as a Werewolf.",
      );
    } else if (copiedRole === "werewolf" || copiedRole === "mason") {
      setNightMessage(
        `You copied the ${roleById[copiedRole].name}. Join that role when the narrator calls it.`,
      );
    } else if (copiedRole === "insomniac") {
      setNightMessage(
        "You copied the Insomniac. Pick up this phone again after the regular Insomniac turn.",
      );
    }
    setNightReveals([{ label: target.name, role: copiedRole }]);
    setNightStep("result");
  };

  const swapPlayerCards = (firstId: string, secondId: string) => {
    const firstCard = players.find((player) => player.id === firstId)?.card;
    const secondCard = players.find((player) => player.id === secondId)?.card;
    if (!firstCard || !secondCard) return null;
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id === firstId) return { ...player, card: secondCard };
        if (player.id === secondId) return { ...player, card: firstCard };
        return player;
      }),
    );
    return { firstCard, secondCard };
  };

  const performNightAction = () => {
    if (!nightActionRole) return;
    if (nightActionRole === "doppelganger") {
      copyDoppelgangerRole();
      return;
    }

    if (nightActionRole === "werewolf") {
      if (wolfActorIds.length > 1) {
        const names = players
          .filter((player) => wolfActorIds.includes(player.id))
          .map((player) => player.name);
        setNightMessage(`The werewolves are ${names.join(" and ")}.`);
      } else {
        const center = centerCards.find(
          (card) => card.id === nightSelections[0],
        );
        if (!center) return;
        setNightMessage("You are the lone werewolf.");
        setNightReveals([
          { label: center.label, role: effectiveRole(center.card) },
        ]);
      }
      setNightStep("result");
      return;
    }

    if (nightActionRole === "minion") {
      const wolves = players.filter((player) =>
        wolfActorIds.includes(player.id),
      );
      setNightMessage(
        wolves.length > 0
          ? `The werewolves are ${wolves.map((wolf) => wolf.name).join(" and ")}.`
          : "No player began as a Werewolf. You must get another player eliminated.",
      );
      setNightStep("result");
      return;
    }

    if (nightActionRole === "mason") {
      const masons = players.filter((player) =>
        nightActorIds.includes(player.id),
      );
      setNightMessage(
        masons.length > 1
          ? `The Masons are ${masons.map((mason) => mason.name).join(" and ")}.`
          : "You are the only Mason among the players.",
      );
      setNightStep("result");
      return;
    }

    if (nightActionRole === "seer") {
      if (seerRevealTarget === "player") {
        const target = players.find(
          (player) => player.id === nightSelections[0],
        );
        if (!target?.card) return;
        setNightReveals([
          { label: target.name, role: effectiveRole(target.card) },
        ]);
      } else {
        const centers = centerCards.filter((card) =>
          nightSelections.includes(card.id),
        );
        if (centers.length !== 2) return;
        setNightReveals(
          centers.map((center) => ({
            label: center.label,
            role: effectiveRole(center.card),
          })),
        );
      }
      setNightMessage("Memorize what you saw.");
      setNightStep("result");
      return;
    }

    if (nightActionRole === "robber") {
      const target = players.find((player) => player.id === nightSelections[0]);
      if (!target || !nightActionActorId) return;
      const swapped = swapPlayerCards(nightActionActorId, target.id);
      if (!swapped) return;
      setNightMessage(`You traded roles with ${target.name}.`);
      setNightReveals([
        { label: "Your new role", role: effectiveRole(swapped.secondCard) },
      ]);
      setNightStep("result");
      return;
    }

    if (nightActionRole === "troublemaker") {
      if (nightSelections.length !== 2) return;
      const first = players.find((player) => player.id === nightSelections[0]);
      const second = players.find((player) => player.id === nightSelections[1]);
      if (!first || !second) return;
      swapPlayerCards(first.id, second.id);
      setNightMessage(
        `You swapped ${first.name} and ${second.name}. Do not view either role.`,
      );
      setNightStep("result");
      return;
    }

    if (nightActionRole === "drunk") {
      const center = centerCards.find((card) => card.id === nightSelections[0]);
      const actor = players.find((player) => player.id === nightActionActorId);
      if (!center || !actor?.card) return;
      const oldPlayerCard = actor.card;
      const oldCenterCard = center.card;
      setPlayers((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === actor.id ? { ...player, card: oldCenterCard } : player,
        ),
      );
      setCenterCards((cards) =>
        cards.map((card) =>
          card.id === center.id ? { ...card, card: oldPlayerCard } : card,
        ),
      );
      setNightMessage(
        `You exchanged your role with ${center.label}. Do not look at your new role.`,
      );
      setNightStep("result");
      return;
    }

    if (nightActionRole === "insomniac") {
      const actor = players.find((player) => player.id === nightActionActorId);
      if (!actor?.card) return;
      setNightMessage("This is the role in front of you now.");
      setNightReveals([
        { label: "Your current role", role: effectiveRole(actor.card) },
      ]);
      setNightStep("result");
    }
  };

  const requiredNightSelections = (() => {
    if (!nightActionRole) return 0;
    if (nightActionRole === "doppelganger") return 1;
    if (nightActionRole === "werewolf")
      return wolfActorIds.length === 1 ? 1 : 0;
    if (nightActionRole === "seer")
      return seerRevealTarget === "center" ? 2 : 1;
    if (nightActionRole === "robber" || nightActionRole === "drunk") return 1;
    if (nightActionRole === "troublemaker") return 2;
    return 0;
  })();
  const canSubmitNightAction =
    nightSelections.length === requiredNightSelections;

  const hideAndContinueNight = () => {
    setNightSelections([]);
    setNightMessage("");
    setNightReveals([]);
    if (nightStageIndex + 1 >= nightStages.length) {
      setNightStep("complete");
      return;
    }
    setNightStageIndex((index) => index + 1);
    setNightStep("calling");
  };

  const startVoting = () => {
    setVoteIndex(0);
    setVoteVisible(false);
    setPendingVote("");
    setVotes({});
    setPhase(GamePhase.Voting);
  };

  const calculateResult = (submittedVotes: Record<string, string>) => {
    const voteCounts: VoteCount[] = players.map((player) => {
      const voterIds = Object.entries(submittedVotes)
        .filter(([, targetId]) => targetId === player.id)
        .map(([voterId]) => voterId);
      return {
        playerId: player.id,
        name: player.name,
        count: voterIds.length,
        voters: voterIds.map(
          (id) => players.find((player) => player.id === id)?.name ?? "Unknown",
        ),
      };
    });
    const highestCount = Math.max(...voteCounts.map((entry) => entry.count));
    const eliminated = new Set<string>(
      highestCount >= 2
        ? voteCounts
            .filter((entry) => entry.count === highestCount)
            .map((entry) => entry.playerId)
        : [],
    );

    const hunterQueue = [...eliminated];
    for (let index = 0; index < hunterQueue.length; index += 1) {
      const player = players.find(
        (candidate) => candidate.id === hunterQueue[index],
      );
      if (!player?.card || effectiveRole(player.card) !== "hunter") continue;
      const targetId = submittedVotes[player.id];
      if (targetId && !eliminated.has(targetId)) {
        eliminated.add(targetId);
        hunterQueue.push(targetId);
      }
    }

    const finalRoles = players.map((player) => ({
      player,
      role: player.card ? effectiveRole(player.card) : "villager",
    }));
    const werewolves = finalRoles.filter(({ role }) => role === "werewolf");
    const minions = finalRoles.filter(({ role }) => role === "minion");
    const tannerWasEliminated = finalRoles.some(
      ({ player, role }) => role === "tanner" && eliminated.has(player.id),
    );
    const winningTeams: Team[] = [];

    if (werewolves.length > 0) {
      if (werewolves.some(({ player }) => eliminated.has(player.id))) {
        winningTeams.push("village");
      } else {
        winningTeams.push("werewolf");
      }
    } else if (minions.length > 0) {
      const aNonMinionDied = [...eliminated].some(
        (id) => !minions.some(({ player }) => player.id === id),
      );
      winningTeams.push(aNonMinionDied ? "werewolf" : "village");
    } else if (eliminated.size === 0) {
      winningTeams.push("village");
    }

    if (tannerWasEliminated) winningTeams.push("tanner");

    setResult({
      eliminatedIds: [...eliminated],
      voteCounts,
      winningTeams,
      hadPlayerWerewolf: werewolves.length > 0,
    });
    setPhase(GamePhase.Reveal);
    void releaseWakeLock();
  };

  const submitVote = () => {
    if (!currentVotePlayer || !pendingVote) return;
    const submittedVotes = { ...votes, [currentVotePlayer.id]: pendingVote };
    setPendingVote("");
    setVoteVisible(false);
    if (voteIndex + 1 < players.length) {
      setVotes(submittedVotes);
      setVoteIndex((index) => index + 1);
      return;
    }
    setVotes(submittedVotes);
    calculateResult(submittedVotes);
  };

  const resetGame = () => {
    void releaseWakeLock();
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        initialRole: null,
        card: null,
      })),
    );
    setCenterCards([]);
    setRoleIndex(0);
    setRoleVisible(false);
    setNightStages([]);
    setNightStageIndex(0);
    setNightStep("intro");
    setDoppelgangerPlayerId("");
    setDoppelgangerCopiedRole(null);
    setVoteIndex(0);
    setVoteVisible(false);
    setPendingVote("");
    setVotes({});
    setResult(null);
    setPhase(GamePhase.Setup);
  };

  return {
    addPlayer,
    addRole,
    beginNight,
    canSubmitNightAction,
    centerCards,
    claimNightTurn,
    currentNightStage,
    currentRolePlayer,
    currentVotePlayer,
    doppelgangerCopiedRole,
    hideAndContinueNight,
    hideRoleAndPass,
    nightActionActorId,
    nightActionRole,
    nightActorIds,
    nightMessage,
    nightReveals,
    nightSelections,
    nightStageIndex,
    nightStages,
    nightStep,
    pendingVote,
    performNightAction,
    phase,
    playerCount: players.length,
    players,
    removePlayer,
    removeRole,
    requiredNightSelections,
    requiredRoleCount,
    resetGame,
    result,
    revealRole,
    roleCounts,
    roleIndex,
    roleVisible,
    rolesCustomized,
    seerRevealTarget,
    selectedRoles,
    setPendingVote,
    setSeerRevealTarget: (target: "player" | "center") => {
      setSeerRevealTarget(target);
      setNightSelections([]);
    },
    setVoteVisible,
    setupProblem,
    startGame,
    startVoting,
    submitVote,
    toggleNightSelection,
    updatePlayerName,
    useRecommendedRoles,
    voteIndex,
    voteVisible,
    votes,
    wolfActorIds,
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
