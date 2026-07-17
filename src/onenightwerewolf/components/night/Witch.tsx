import { useEffect, useState } from "preact/hooks";
import { centerLabel } from "../../center";
import type { CenterSlot, NightReveal, PlayerIndex } from "../../types";
import { CenterPicker } from "../CenterPicker";
import { NightActionStep } from "../NightActionStep";
import * as styles from "../NightPage.css";
import { NightResultStep, RevealList } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

type CenterReveal = Extract<NightReveal, { kind: "center" }>;

type WitchResult = {
  viewedCenter: CenterReveal;
  playerName: string;
};

type WitchState =
  | { step: "choose-center"; selectedCenter: CenterSlot | null }
  | {
      step: "choose-player";
      viewedCenter: CenterReveal;
      selectedPlayer: PlayerIndex | null;
    }
  | { step: "result"; result: WitchResult };

export function WitchNightAction({
  game,
  invocation,
}: RoleNightActionProps<"witch">) {
  const [state, setState] = useState<WitchState>({
    step: "choose-center",
    selectedCenter: null,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.step]);

  switch (state.step) {
    case "choose-center": {
      const submit = () => {
        if (state.selectedCenter === null) return false;
        const slot = state.selectedCenter;
        const center = game.centerCards.find((card) => card.slot === slot);
        if (!center) return false;
        setState({
          step: "choose-player",
          viewedCenter: {
            kind: "center",
            centerSlot: slot,
            role: center.card.role,
          },
          selectedPlayer: null,
        });
      };
      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedCenter === null,
              label: "View center role",
              onClick: submit,
            },
            {
              label: "Do nothing",
              onClick: game.finishNightAction,
            },
          ]}
          invocation={invocation}
          submissionKey={state.step}
        >
          <CenterPicker
            centerSlots={game.centerCards.map((center) => center.slot)}
            maxSelections={1}
            onChange={(selectedCenters) =>
              setState({
                step: "choose-center",
                selectedCenter: selectedCenters[0] ?? null,
              })
            }
            selected={
              state.selectedCenter === null ? [] : [state.selectedCenter]
            }
          />
        </NightActionStep>
      );
    }
    case "choose-player": {
      const choices = buildPlayerChoices(game, invocation.actorIndex, {
        allowSelf: true,
      });
      const submit = () => {
        if (state.selectedPlayer === null) return false;
        const playerIndex = state.selectedPlayer;
        const player = game.players[playerIndex];
        if (!player) return false;
        game.swapPlayerAndCenterCard(
          playerIndex,
          state.viewedCenter.centerSlot,
        );
        setState({
          step: "result",
          result: { viewedCenter: state.viewedCenter, playerName: player.name },
        });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: state.selectedPlayer === null,
              label: "Exchange role",
              onClick: submit,
            },
          ]}
          instruction={`You saw the ${centerLabel(
            state.viewedCenter.centerSlot,
          )} center role. You must now exchange it with an eligible player’s role without viewing that role.`}
          invocation={invocation}
          submissionKey={state.step}
        >
          <section className={styles.revealSection}>
            <h3 className={styles.revealTitle}>Center role you viewed</h3>
            <RevealList reveals={[state.viewedCenter]} />
          </section>
          <PlayerPicker
            choices={choices}
            maxSelections={1}
            onChange={(selectedPlayers) =>
              setState({
                step: "choose-player",
                viewedCenter: state.viewedCenter,
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
            <>
              You exchanged the{" "}
              <strong>
                {centerLabel(state.result.viewedCenter.centerSlot)}
              </strong>{" "}
              center role with <strong>{state.result.playerName}</strong>’s
              role.
            </>
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={[state.result.viewedCenter]}
        />
      );
  }
}
