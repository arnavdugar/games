import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { artifactIds } from "../artifacts";
import {
  buildNightStages,
  effectiveRole,
  isAwakeWerewolfRole,
  isImmediateDoppelgangerRole,
  isWerewolfRole,
  type NightStage,
  recommendedRoles,
  roleById,
  teamForRole,
} from "../roles";
import {
  type CenterCard,
  type CenterSlot,
  type GamePhase,
  type GameState,
  type NightActionRole,
  type NightInvocation,
  type Player,
  type PlayerIndex,
  type PlayerOutcome,
  type RoleCard,
  type RoleId,
  type RotationDirection,
  type Team,
  type VoteCount,
} from "../types";

const initialPlayers: Player[] = Array.from({ length: 3 }, () => ({
  name: "",
  initialRole: null,
  card: null,
  shielded: false,
  faceUp: false,
  artifact: null,
}));

const primaryCenterSlots = ["left", "middle", "right"] as const;

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function useGameState() {
  const [gameState, setGameState] = useState<GameState>({ phase: "setup" });
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [customRoles, setCustomRoles] = useState<RoleId[] | null>(null);
  const [skipDeviceFreeNightActions, setSkipDeviceFreeNightActions] =
    useState(false);
  const [centerCards, setCenterCards] = useState<CenterCard[]>([]);
  const [initialCardIds, setInitialCardIds] = useState<string[]>([]);

  const selectedRoles = customRoles ?? recommendedRoles(players.length);

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
    if (!selectedRoles.some(isWerewolfRole)) {
      return "Include at least one Werewolf role.";
    }
    return "";
  })();

  const doppelgangerPlayerIndex = (() => {
    const playerIndex = players.findIndex(
      (player) => player.initialRole === "doppelganger",
    );
    return playerIndex === -1 ? null : playerIndex;
  })();
  const doppelgangerOriginalCardId =
    doppelgangerPlayerIndex === null
      ? null
      : (initialCardIds[doppelgangerPlayerIndex] ?? null);
  const doppelgangerOriginalCard = doppelgangerOriginalCardId
    ? (players.find((player) => player.card?.id === doppelgangerOriginalCardId)
        ?.card ??
      centerCards.find(
        (center) => center.card.id === doppelgangerOriginalCardId,
      )?.card ??
      null)
    : null;
  const doppelgangerCopiedRole =
    doppelgangerOriginalCard?.role === "doppelganger"
      ? (doppelgangerOriginalCard.copiedRole ?? null)
      : null;
  const doppelgangerTransformedRole =
    doppelgangerOriginalCard?.role === "doppelganger"
      ? (doppelgangerOriginalCard.transformedRole ?? null)
      : null;

  const wolfIdentities: {
    playerIndex: PlayerIndex;
    role: "werewolf" | "dream-wolf";
  }[] = players.flatMap((player, playerIndex) =>
    player.initialRole && isWerewolfRole(player.initialRole)
      ? [
          {
            playerIndex,
            role:
              player.initialRole === "dream-wolf"
                ? ("dream-wolf" as const)
                : ("werewolf" as const),
          },
        ]
      : [],
  );
  if (
    doppelgangerPlayerIndex !== null &&
    ((doppelgangerCopiedRole && isWerewolfRole(doppelgangerCopiedRole)) ||
      doppelgangerTransformedRole === "werewolf") &&
    !wolfIdentities.some(
      (identity) => identity.playerIndex === doppelgangerPlayerIndex,
    )
  ) {
    wolfIdentities.push({
      playerIndex: doppelgangerPlayerIndex,
      role: doppelgangerCopiedRole === "dream-wolf" ? "dream-wolf" : "werewolf",
    });
  }

  const awakeWolfActorIndexes = players.flatMap((player, playerIndex) =>
    player.initialRole && isAwakeWerewolfRole(player.initialRole)
      ? [playerIndex]
      : [],
  );
  if (
    doppelgangerPlayerIndex !== null &&
    ((doppelgangerCopiedRole && isAwakeWerewolfRole(doppelgangerCopiedRole)) ||
      doppelgangerTransformedRole === "werewolf") &&
    !awakeWolfActorIndexes.includes(doppelgangerPlayerIndex)
  ) {
    awakeWolfActorIndexes.push(doppelgangerPlayerIndex);
  }

  const findNextNightInvocation = (
    stages: readonly NightStage[],
    start: number,
  ): NightInvocation | null => {
    for (let index = start; index < stages.length; index += 1) {
      const stage = stages[index];
      if (!stage) continue;

      let role: NightActionRole;
      let actorIndexes: PlayerIndex[];
      let isDoppelgangerCopy = false;

      switch (stage) {
        case "doppelganger":
          if (doppelgangerPlayerIndex === null) continue;
          actorIndexes = [doppelgangerPlayerIndex];
          if (
            doppelgangerCopiedRole &&
            isImmediateDoppelgangerRole(doppelgangerCopiedRole)
          ) {
            role = doppelgangerCopiedRole;
            isDoppelgangerCopy = true;
          } else {
            role = "doppelganger";
          }
          break;
        case "doppelganger-insomniac":
          role = "insomniac";
          actorIndexes =
            doppelgangerCopiedRole === role && doppelgangerPlayerIndex !== null
              ? [doppelgangerPlayerIndex]
              : [];
          isDoppelgangerCopy = true;
          break;
        case "doppelganger-revealer":
          role = "revealer";
          actorIndexes =
            doppelgangerCopiedRole === role && doppelgangerPlayerIndex !== null
              ? [doppelgangerPlayerIndex]
              : [];
          isDoppelgangerCopy = true;
          break;
        case "doppelganger-curator":
          role = "curator";
          actorIndexes =
            doppelgangerCopiedRole === role && doppelgangerPlayerIndex !== null
              ? [doppelgangerPlayerIndex]
              : [];
          isDoppelgangerCopy = true;
          break;
        case "werewolf":
          if (
            skipDeviceFreeNightActions &&
            (awakeWolfActorIndexes.length !== 1 || wolfIdentities.length !== 1)
          ) {
            continue;
          }
          role = stage;
          actorIndexes = awakeWolfActorIndexes;
          break;
        case "minion":
        case "mason":
          if (skipDeviceFreeNightActions) continue;
          role = stage;
          actorIndexes = players.flatMap((player, playerIndex) =>
            player.initialRole === stage ? [playerIndex] : [],
          );
          if (
            doppelgangerCopiedRole === stage &&
            doppelgangerPlayerIndex !== null
          ) {
            actorIndexes.push(doppelgangerPlayerIndex);
          }
          break;
        default:
          role = stage;
          actorIndexes = players.flatMap((player, playerIndex) =>
            player.initialRole === stage ? [playerIndex] : [],
          );
          break;
      }

      const actorIndex = actorIndexes[0];
      if (actorIndex === undefined) continue;

      return {
        stageIndex: index,
        role,
        actorIndex,
        actorIndexes,
        isDoppelgangerCopy,
      };
    }
    return null;
  };

  const artifactRecipients = players.flatMap((player, playerIndex) =>
    player.artifact
      ? [{ playerIndex, playerName: player.name, artifact: player.artifact }]
      : [],
  );
  const addPlayer = () => {
    if (players.length >= 10) return;
    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        name: "",
        initialRole: null,
        card: null,
        shielded: false,
        faceUp: false,
        artifact: null,
      },
    ]);
  };

  const getNightPlayerTargets = (
    actorIndex: PlayerIndex,
    options: {
      allowSelf?: boolean;
      allowShielded?: boolean;
      excludedPlayerIndexes?: ReadonlySet<PlayerIndex>;
      visibleRoles?: ReadonlyMap<PlayerIndex, RoleId>;
    } = {},
  ) => {
    const {
      allowSelf = false,
      allowShielded = false,
      excludedPlayerIndexes = new Set<PlayerIndex>(),
      visibleRoles = new Map<PlayerIndex, RoleId>(),
    } = options;

    return players.map((player, playerIndex) => ({
      playerIndex,
      playerName: player.name,
      visibleRole: player.faceUp
        ? (player.card?.role ?? null)
        : (visibleRoles.get(playerIndex) ?? null),
      isActor: playerIndex === actorIndex,
      shielded: player.shielded,
      available:
        (allowSelf || playerIndex !== actorIndex) &&
        (allowShielded || !player.shielded) &&
        !excludedPlayerIndexes.has(playerIndex),
    }));
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

  const setRoleCount = (role: RoleId, count: number) => {
    const definition = roleById[role];
    if (
      count < 0 ||
      count > definition.max ||
      count % definition.increment !== 0
    ) {
      return;
    }
    setCustomRoles((roles) => [
      ...(roles ?? recommendedRoles(players.length)).filter(
        (selectedRole) => selectedRole !== role,
      ),
      ...Array.from({ length: count }, () => role),
    ]);
  };

  const useRecommendedRoles = () => {
    setCustomRoles(null);
  };

  const clearRoles = () => {
    setCustomRoles([]);
  };

  const startGame = () => {
    if (setupProblem) return;
    const cards = shuffle(
      selectedRoles.map<RoleCard>((role, index) => ({
        id: `card-${index}`,
        role,
      })),
    );
    const assignedPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim(),
      initialRole: cards[index].role,
      card: cards[index],
      shielded: false,
      faceUp: false,
      artifact: null,
    }));
    const assignedCenter: CenterCard[] = primaryCenterSlots.map(
      (slot, index) => ({
        id: `center-${slot}`,
        slot,
        card: cards[players.length + index],
      }),
    );
    if (selectedRoles.includes("alpha-wolf")) {
      assignedCenter.push({
        id: "center-alpha-wolf",
        slot: "alpha-wolf",
        card: {
          id: "card-alpha-wolf-center",
          role: "werewolf",
        },
      });
    }
    setPlayers(assignedPlayers);
    setCenterCards(assignedCenter);
    setInitialCardIds(assignedPlayers.map((player) => player.card?.id ?? ""));
    setGameState({
      phase: "roles",
      role: { step: "handoff", playerIndex: 0 },
    });
  };

  const revealRole = () => {
    setGameState((current) => {
      if (current.phase !== "roles" || current.role.step !== "handoff") {
        return current;
      }
      return {
        ...current,
        role: {
          step: "reveal",
          playerIndex: current.role.playerIndex,
        },
      };
    });
  };

  const hideRoleAndPass = () => {
    setGameState((current) => {
      if (current.phase !== "roles" || current.role.step !== "reveal") {
        return current;
      }
      if (current.role.playerIndex + 1 >= players.length) {
        return {
          phase: "night",
          night: { step: "intro" },
          stages: buildNightStages(selectedRoles),
        };
      }
      return {
        ...current,
        role: {
          step: "handoff",
          playerIndex: current.role.playerIndex + 1,
        },
      };
    });
  };

  const beginNight = () => {
    setGameState((current) => {
      if (current.phase !== "night") return current;
      const invocation = findNextNightInvocation(current.stages, 0);
      return {
        ...current,
        night: invocation
          ? { step: "calling", invocation }
          : { step: "complete" },
      };
    });
  };

  const finishNightAction = () => {
    setGameState((current) => {
      if (current.phase !== "night" || current.night.step !== "acting") {
        return current;
      }
      const invocation = findNextNightInvocation(
        current.stages,
        current.night.invocation.stageIndex + 1,
      );
      return {
        ...current,
        night: invocation
          ? { step: "calling", invocation }
          : { step: "complete" },
      };
    });
  };

  const openNightAction = () => {
    setGameState((current) => {
      if (current.phase !== "night" || current.night.step !== "calling") {
        return current;
      }
      return {
        ...current,
        night: { step: "acting", invocation: current.night.invocation },
      };
    });
  };

  const finishNight = () => {
    setGameState((current) => {
      if (current.phase !== "night" || current.night.step !== "complete") {
        return current;
      }
      return artifactRecipients.length === 0
        ? { phase: "discussion" }
        : {
            phase: "artifacts",
            artifact: { step: "handoff", playerIndex: 0 },
          };
    });
  };

  const updateCardById = (
    cardId: string,
    update: (card: RoleCard) => RoleCard,
  ) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.card?.id === cardId
          ? { ...player, card: update(player.card) }
          : player,
      ),
    );
    setCenterCards((currentCards) =>
      currentCards.map((center) =>
        center.card.id === cardId
          ? { ...center, card: update(center.card) }
          : center,
      ),
    );
  };

  const recordDoppelgangerCopy = (targetIndex: PlayerIndex) => {
    const copiedRole = players[targetIndex].card!.role;
    updateCardById(doppelgangerOriginalCardId!, (card) => ({
      ...card,
      copiedRole,
    }));
    if (isImmediateDoppelgangerRole(copiedRole)) {
      setGameState((current) => {
        if (
          current.phase !== "night" ||
          current.night.step !== "acting" ||
          current.night.invocation.role !== "doppelganger"
        ) {
          return current;
        }
        return {
          ...current,
          night: {
            step: "acting",
            invocation: {
              ...current.night.invocation,
              role: copiedRole,
              isDoppelgangerCopy: true,
            },
          },
        };
      });
    }
    return copiedRole;
  };

  const shieldPlayer = (playerIndex: PlayerIndex) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) =>
        index === playerIndex ? { ...player, shielded: true } : player,
      ),
    );
  };

  const swapPlayerCards = (
    firstPlayerIndex: PlayerIndex,
    secondPlayerIndex: PlayerIndex,
  ) => {
    setPlayers((currentPlayers) => {
      const firstCard = currentPlayers[firstPlayerIndex].card;
      const secondCard = currentPlayers[secondPlayerIndex].card;
      return currentPlayers.map((player, playerIndex) => {
        if (playerIndex === firstPlayerIndex) {
          return { ...player, card: secondCard };
        }
        if (playerIndex === secondPlayerIndex) {
          return { ...player, card: firstCard };
        }
        return player;
      });
    });
  };

  const swapPlayerAndCenterCard = (
    playerIndex: PlayerIndex,
    slot: CenterSlot,
  ) => {
    const playerCard = players[playerIndex].card!;
    const center = centerCards.find((card) => card.slot === slot)!;

    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) =>
        index === playerIndex ? { ...player, card: center.card } : player,
      ),
    );
    setCenterCards((currentCards) =>
      currentCards.map((card) =>
        card.slot === slot ? { ...card, card: playerCard } : card,
      ),
    );
  };

  const rotatePlayerCards = (
    playerIndexes: readonly PlayerIndex[],
    direction: RotationDirection,
  ) => {
    const offset = direction === "clockwise" ? 1 : -1;
    setPlayers((currentPlayers) => {
      const cards = playerIndexes.map(
        (playerIndex) => currentPlayers[playerIndex].card,
      );
      return currentPlayers.map((player, playerIndex) => {
        const destinationIndex = playerIndexes.indexOf(playerIndex);
        if (destinationIndex === -1) return player;
        const sourceIndex =
          (destinationIndex - offset + playerIndexes.length) %
          playerIndexes.length;
        return { ...player, card: cards[sourceIndex] };
      });
    });
  };

  const transformActingCard = (
    actorIndex: PlayerIndex,
    transformedRole: "werewolf" | "tanner",
  ) => {
    updateCardById(initialCardIds[actorIndex], (card) => ({
      ...card,
      transformedRole,
    }));
  };

  const setPlayerFaceUp = (playerIndex: PlayerIndex, faceUp: boolean) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((currentPlayer, index) =>
        index === playerIndex ? { ...currentPlayer, faceUp } : currentPlayer,
      ),
    );
  };

  const placeRandomArtifact = (playerIndex: PlayerIndex) => {
    const usedArtifacts = new Set(
      players.flatMap((currentPlayer) =>
        currentPlayer.artifact ? [currentPlayer.artifact] : [],
      ),
    );
    const artifact = shuffle(
      artifactIds.filter((artifactId) => !usedArtifacts.has(artifactId)),
    )[0]!;

    setPlayers((currentPlayers) =>
      currentPlayers.map((currentPlayer, index) =>
        index === playerIndex ? { ...currentPlayer, artifact } : currentPlayer,
      ),
    );
  };

  const revealArtifact = () => {
    setGameState((current) => {
      if (
        current.phase !== "artifacts" ||
        current.artifact.step !== "handoff"
      ) {
        return current;
      }
      return {
        ...current,
        artifact: {
          step: "reveal",
          playerIndex: current.artifact.playerIndex,
        },
      };
    });
  };

  const hideArtifactAndContinue = () => {
    setGameState((current) => {
      if (current.phase !== "artifacts" || current.artifact.step !== "reveal") {
        return current;
      }
      const nextIndex = current.artifact.playerIndex + 1;
      return nextIndex >= artifactRecipients.length
        ? { phase: "discussion" }
        : {
            ...current,
            artifact: { step: "handoff", playerIndex: nextIndex },
          };
    });
  };

  const startVoting = () => {
    setGameState((current) => {
      if (current.phase !== "discussion") return current;
      return {
        phase: "voting",
        voting: { step: "handoff", voterIndex: 0, votes: [] },
      };
    });
  };

  const buildGameResult = (submittedVotes: PlayerIndex[] | null) => {
    const votesRecorded = submittedVotes !== null;
    const voteCounts: VoteCount[] = players.map((player, playerIndex) => {
      const voterIndexes = submittedVotes
        ? submittedVotes.flatMap((targetIndex, voterIndex) =>
            targetIndex === playerIndex ? [voterIndex] : [],
          )
        : [];
      return {
        playerIndex,
        name: player.name,
        count: voterIndexes.length,
        voters: voterIndexes.map(
          (voterIndex) => players[voterIndex]?.name ?? "Unknown",
        ),
      };
    });
    const finalRoleEntries = players.map((player, playerIndex) => {
      const artifact = player.artifact;
      const finalRole = player.card
        ? effectiveRole(player.card, artifact)
        : "villager";
      return { playerIndex, finalRole, artifact };
    });
    const protectedIndexes = new Set<PlayerIndex>(
      finalRoleEntries.flatMap(({ playerIndex, finalRole }) => {
        const protectedIndex = submittedVotes?.[playerIndex];
        return finalRole === "bodyguard" && protectedIndex !== undefined
          ? [protectedIndex]
          : [];
      }),
    );
    const eligibleVoteCounts = voteCounts.filter(
      ({ playerIndex }) => !protectedIndexes.has(playerIndex),
    );
    const highestCount = Math.max(
      0,
      ...eligibleVoteCounts.map((entry) => entry.count),
    );
    const eliminated = new Set<PlayerIndex>(
      votesRecorded && highestCount >= 2
        ? eligibleVoteCounts
            .filter((entry) => entry.count === highestCount)
            .map((entry) => entry.playerIndex)
        : [],
    );

    const hunterQueue = [...eliminated];
    for (let index = 0; index < hunterQueue.length; index += 1) {
      const playerIndex = hunterQueue[index];
      const finalRole = finalRoleEntries[playerIndex]?.finalRole;
      if (finalRole !== "hunter") continue;
      const targetIndex = submittedVotes?.[playerIndex];
      if (
        targetIndex !== undefined &&
        !eliminated.has(targetIndex) &&
        !protectedIndexes.has(targetIndex)
      ) {
        eliminated.add(targetIndex);
        hunterQueue.push(targetIndex);
      }
    }

    const werewolves = finalRoleEntries.filter(({ finalRole }) =>
      isWerewolfRole(finalRole),
    );
    const minions = finalRoleEntries.filter(
      ({ finalRole }) => finalRole === "minion",
    );
    const tannerWasEliminated = finalRoleEntries.some(
      ({ playerIndex, finalRole }) =>
        finalRole === "tanner" && eliminated.has(playerIndex),
    );
    const werewolfWasEliminated = werewolves.some(({ playerIndex }) =>
      eliminated.has(playerIndex),
    );
    const winningTeams: Team[] = [];

    if (votesRecorded) {
      if (tannerWasEliminated) {
        if (werewolfWasEliminated) winningTeams.push("village");
        winningTeams.push("tanner");
      } else if (werewolves.length > 0) {
        winningTeams.push(werewolfWasEliminated ? "village" : "werewolf");
      } else if (minions.length > 0) {
        const aNonMinionDied = [...eliminated].some(
          (playerIndex) =>
            !minions.some((minion) => minion.playerIndex === playerIndex),
        );
        winningTeams.push(aNonMinionDied ? "werewolf" : "village");
      } else if (eliminated.size === 0) {
        winningTeams.push("village");
      }
    }

    const playerOutcomes: PlayerOutcome[] = finalRoleEntries.map(
      ({ playerIndex, finalRole, artifact }) => {
        const player = players[playerIndex];
        const team = teamForRole(finalRole);
        return {
          playerIndex,
          name: player?.name ?? "Unknown",
          initialRole: player?.initialRole ?? "villager",
          finalRole,
          team,
          won:
            votesRecorded &&
            (team === "tanner"
              ? eliminated.has(playerIndex)
              : winningTeams.includes(team)),
          artifact,
          protected: protectedIndexes.has(playerIndex),
          eliminated: eliminated.has(playerIndex),
        };
      },
    );

    return {
      eliminatedPlayerIndexes: [...eliminated],
      voteCounts,
      winningTeams,
      hadPlayerWerewolf: werewolves.length > 0,
      playerOutcomes,
      votesRecorded,
    };
  };

  const revealRoles = () => {
    setGameState((current) =>
      current.phase === "discussion"
        ? { phase: "reveal", result: buildGameResult(null) }
        : current,
    );
  };

  const revealVote = () => {
    setGameState((current) => {
      if (current.phase !== "voting" || current.voting.step !== "handoff") {
        return current;
      }
      return {
        ...current,
        voting: {
          step: "choosing",
          voterIndex: current.voting.voterIndex,
          pendingVote: null,
          votes: current.voting.votes,
        },
      };
    });
  };

  const selectVote = (pendingVote: PlayerIndex) => {
    if (!players[pendingVote]) return;
    setGameState((current) => {
      if (
        current.phase !== "voting" ||
        current.voting.step !== "choosing" ||
        pendingVote === current.voting.voterIndex
      ) {
        return current;
      }
      return {
        ...current,
        voting: { ...current.voting, pendingVote },
      };
    });
  };

  const submitVote = () => {
    setGameState((current) => {
      if (
        current.phase !== "voting" ||
        current.voting.step !== "choosing" ||
        current.voting.pendingVote === null
      ) {
        return current;
      }
      const submittedVotes = [...current.voting.votes];
      submittedVotes[current.voting.voterIndex] = current.voting.pendingVote;
      if (current.voting.voterIndex + 1 < players.length) {
        return {
          ...current,
          voting: {
            step: "handoff",
            voterIndex: current.voting.voterIndex + 1,
            votes: submittedVotes,
          },
        };
      }

      return {
        phase: "reveal",
        result: buildGameResult(submittedVotes),
      };
    });
  };

  const resetGame = () => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        initialRole: null,
        card: null,
        shielded: false,
        faceUp: false,
        artifact: null,
      })),
    );
    setCenterCards([]);
    setInitialCardIds([]);
    setGameState({ phase: "setup" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameState]);

  const phaseGroups = {
    setup: {
      addPlayer,
      clearRoles,
      players,
      requiredRoleCount,
      roleCounts,
      selectedRoles,
      setRoleCount,
      setSkipDeviceFreeNightActions,
      setupProblem,
      skipDeviceFreeNightActions,
      startGame,
      removePlayer,
      updatePlayerName,
      useRecommendedRoles,
    },
    roles: {
      hideRoleAndPass,
      players,
      revealRole,
    },
    night: {
      beginNight,
      centerCards,
      finishNight,
      finishNightAction,
      getNightPlayerTargets,
      openNightAction,
      placeRandomArtifact,
      players,
      recordDoppelgangerCopy,
      rotatePlayerCards,
      setPlayerFaceUp,
      shieldPlayer,
      swapPlayerAndCenterCard,
      swapPlayerCards,
      transformActingCard,
      wolfIdentities,
    },
    artifacts: {
      hideArtifactAndContinue,
      recipients: artifactRecipients,
      revealArtifact,
    },
    discussion: {
      players,
      revealRoles,
      startVoting,
    },
    voting: {
      players,
      revealVote,
      selectVote,
      submitVote,
    },
    reveal: {
      centerCards,
      startGame,
    },
  } satisfies Record<GamePhase, object>;

  return {
    resetGame,
    state: gameState,
    ...phaseGroups,
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
