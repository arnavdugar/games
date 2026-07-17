import { useState } from "preact/hooks";
import type { CenterSlot, NightReveal, PlayerIndex } from "../../types";
import { CenterPicker } from "../CenterPicker";
import { NightActionStep } from "../NightActionStep";
import * as nightPageStyles from "../NightPage.css";
import { NightResultStep } from "../NightResultStep";
import { buildPlayerChoices, PlayerPicker } from "../PlayerPicker";
import type { RoleNightActionProps } from "./types";

import * as styles from "./Seer.css";

const modes = [
  { key: "player", label: "One player", required: 1 },
  { key: "center", label: "Two center roles", required: 2 },
] as const;

type SeerMode = (typeof modes)[number]["key"];

type SeerState =
  | {
      step: "choosing";
      mode: SeerMode;
      selectedPlayer: PlayerIndex | null;
      selectedCenters: CenterSlot[];
    }
  | { step: "result"; reveals: NightReveal[] };

export function SeerNightAction({
  game,
  invocation,
}: RoleNightActionProps<"seer">) {
  const [state, setState] = useState<SeerState>({
    step: "choosing",
    mode: "player",
    selectedPlayer: null,
    selectedCenters: [],
  });
  switch (state.step) {
    case "choosing": {
      const playerChoices = buildPlayerChoices(game, invocation.actorIndex);
      const required = modes.find(({ key }) => key === state.mode)!.required;
      const selectedCount =
        state.mode === "player"
          ? state.selectedPlayer === null
            ? 0
            : 1
          : state.selectedCenters.length;

      const submit = () => {
        if (selectedCount !== required) return false;
        const reveals: NightReveal[] = [];
        if (state.mode === "player") {
          if (state.selectedPlayer === null) return false;
          const playerIndex = state.selectedPlayer;
          const player = game.players[playerIndex];
          if (!player.card) return false;
          reveals.push({
            kind: "player",
            playerIndex,
            playerName: player.name,
            role: player.card.role,
            visibility: "private",
          });
        } else {
          for (const slot of state.selectedCenters) {
            const center = game.centerCards.find((card) => card.slot === slot);
            if (!center) return false;
            reveals.push({
              kind: "center",
              centerSlot: slot,
              role: center.card.role,
            });
          }
        }
        setState({ step: "result", reveals });
      };

      return (
        <NightActionStep
          actions={[
            {
              disabled: selectedCount !== required,
              label: "Inspect",
              onClick: submit,
            },
            {
              label: "Do nothing",
              onClick: game.finishNightAction,
            },
          ]}
          invocation={invocation}
        >
          <div
            aria-label="Choose what to inspect"
            className={styles.modeSwitch}
            role="radiogroup"
          >
            {modes.map(({ key, label }) => (
              <label className={styles.modeOption} key={key}>
                <input
                  checked={state.mode === key}
                  className={nightPageStyles.hiddenInput}
                  name="seer-mode"
                  onChange={() =>
                    setState({
                      step: "choosing",
                      mode: key,
                      selectedPlayer: null,
                      selectedCenters: [],
                    })
                  }
                  type="radio"
                />
                {label}
              </label>
            ))}
          </div>
          {state.mode === "player" ? (
            <PlayerPicker
              choices={playerChoices}
              maxSelections={1}
              onChange={(selectedPlayers) =>
                setState({
                  ...state,
                  selectedPlayer: selectedPlayers[0] ?? null,
                })
              }
              selected={
                state.selectedPlayer === null ? [] : [state.selectedPlayer]
              }
            />
          ) : (
            <CenterPicker
              centerSlots={game.centerCards.map((center) => center.slot)}
              maxSelections={2}
              onChange={(selectedCenters) =>
                setState({ ...state, selectedCenters })
              }
              selected={state.selectedCenters}
            />
          )}
        </NightActionStep>
      );
    }
    case "result":
      return (
        <NightResultStep
          description={
            state.reveals.length === 1
              ? "Memorize the role you inspected."
              : "Memorize the roles you inspected."
          }
          invocation={invocation}
          finishNightAction={game.finishNightAction}
          presentation="memorize"
          reveals={state.reveals}
        />
      );
  }
}
