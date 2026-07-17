import { useEffect, useState } from "preact/hooks";
import { isWerewolfRole, roleName } from "../../roles";
import type { NightReveal, PlayerIndex } from "../../types";
import { NightActionStep } from "../NightActionStep";
import * as styles from "../NightPage.css";
import { NightResultStep, RevealList } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type PlayerReveal = Extract<NightReveal, { kind: "player" }>;

type PiState =
  | {
      step: "choosing";
      inspections: PlayerReveal[];
      selectedPlayer: PlayerIndex | null;
    }
  | {
      step: "result";
      inspections: PlayerReveal[];
      transformedRole: "werewolf" | "tanner" | null;
    };

export function ParanormalInvestigatorNightAction({
  game,
  invocation,
}: RoleNightActionProps<"paranormal-investigator">) {
  const [state, setState] = useState<PiState>({
    step: "choosing",
    inspections: [],
    selectedPlayer: null,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.step, state.step === "choosing" ? state.inspections.length : 0]);

  switch (state.step) {
    case "choosing": {
      const inspectedIndexes = state.inspections.map(
        (inspection) => inspection.playerIndex,
      );
      const choices = buildPlayerChoices(game, invocation.actorIndex, {
        disabledByPlayer: new Map(
          inspectedIndexes.map((playerIndex) => [
            playerIndex,
            { icon: "visibility", label: "Already inspected" },
          ]),
        ),
        excludedPlayerIndexes: new Set(inspectedIndexes),
      });

      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player.card) return false;
        const role = player.card.role;
        const reveal: PlayerReveal = {
          kind: "player",
          playerIndex,
          playerName: player.name,
          role,
          visibility: "private",
        };
        const inspections = [...state.inspections, reveal];
        const transformedRole = isWerewolfRole(role)
          ? "werewolf"
          : role === "tanner"
            ? "tanner"
            : null;
        if (transformedRole) {
          game.transformActingCard(invocation.actorIndex, transformedRole);
          setState({ step: "result", inspections, transformedRole });
        } else if (inspections.length === 2) {
          setState({ step: "result", inspections, transformedRole: null });
        } else {
          setState({ step: "choosing", inspections, selectedPlayer: null });
        }
      };

      const finish = () => {
        setState({
          step: "result",
          inspections: state.inspections,
          transformedRole: null,
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Inspect player",
              onClick: submit,
            },
            state.inspections.length > 0
              ? { label: "Finish now", onClick: finish }
              : { label: "Do nothing", onClick: game.finishNightAction },
          ]}
          instruction={
            state.inspections.length > 0
              ? "You may inspect one more eligible player’s role, or finish now."
              : undefined
          }
          invocation={invocation}
          submissionKey={state.inspections.length}
        >
          {state.inspections.length > 0 ? (
            <section className={styles.revealSection}>
              <h3 className={styles.revealTitle}>First inspection</h3>
              <RevealList reveals={state.inspections} />
            </section>
          ) : null}
          <PlayerPicker
            choices={choices}
            maxSelections={1}
            onChange={(selectedPlayers) =>
              setState({
                step: "choosing",
                inspections: state.inspections,
                selectedPlayer: selectedPlayers[0] ?? null,
              })
            }
            selected={
              state.selectedPlayer === null ? [] : [state.selectedPlayer]
            }
          />
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description={
            state.transformedRole ? (
              <>
                You saw a <strong>{roleName(state.transformedRole)}</strong> and
                immediately became that role and a part of that team.
              </>
            ) : state.inspections.length === 1 ? (
              "You finished after inspecting one role and remain on your team."
            ) : (
              "You inspected two roles and remain on your team."
            )
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={state.inspections}
        />
      );
  }
}
