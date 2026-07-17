import type { ComponentType } from "preact";
import { GameStep } from "../../common/components/GameStep";
import { useGame } from "../hooks/useGame";
import type { NightActionRole } from "../types";
import { AlphaWolfNightAction } from "./night/AlphaWolf";
import { ApprenticeSeerNightAction } from "./night/ApprenticeSeer";
import { CuratorNightAction } from "./night/Curator";
import { DoppelgangerNightAction } from "./night/Doppelganger";
import { DrunkNightAction } from "./night/Drunk";
import { InsomniacNightAction } from "./night/Insomniac";
import { MasonNightAction } from "./night/Mason";
import { MinionNightAction } from "./night/Minion";
import { MysticWolfNightAction } from "./night/MysticWolf";
import { ParanormalInvestigatorNightAction } from "./night/ParanormalInvestigator";
import { RevealerNightAction } from "./night/Revealer";
import { RobberNightAction } from "./night/Robber";
import { SeerNightAction } from "./night/Seer";
import { SentinelNightAction } from "./night/Sentinel";
import { TroublemakerNightAction } from "./night/Troublemaker";
import type { RoleNightActionProps } from "./night/types";
import { VillageIdiotNightAction } from "./night/VillageIdiot";
import { WerewolfNightAction } from "./night/Werewolf";
import { WitchNightAction } from "./night/Witch";

import * as styles from "./NightPage.css";

const nightRoleComponents = {
  doppelganger: DoppelgangerNightAction,
  sentinel: SentinelNightAction,
  werewolf: WerewolfNightAction,
  "alpha-wolf": AlphaWolfNightAction,
  "mystic-wolf": MysticWolfNightAction,
  minion: MinionNightAction,
  mason: MasonNightAction,
  seer: SeerNightAction,
  "apprentice-seer": ApprenticeSeerNightAction,
  "paranormal-investigator": ParanormalInvestigatorNightAction,
  robber: RobberNightAction,
  witch: WitchNightAction,
  troublemaker: TroublemakerNightAction,
  "village-idiot": VillageIdiotNightAction,
  drunk: DrunkNightAction,
  insomniac: InsomniacNightAction,
  revealer: RevealerNightAction,
  curator: CuratorNightAction,
} satisfies {
  [Role in NightActionRole]: ComponentType<RoleNightActionProps<Role>>;
};

export function NightPage() {
  const game = useGame();
  if (game.state.phase !== "night") return null;

  const { night } = game;
  const state = game.state.night;

  switch (state.step) {
    case "intro":
      return (
        <GameStep
          actions={[{ label: "Continue", onClick: night.beginNight }]}
          beforeTitle={
            <span aria-hidden="true" className={styles.moonIcon}>
              <span
                className={`material-symbols-outlined ${styles.moonIconGlyph}`}
              >
                bedtime
              </span>
            </span>
          }
          description={
            <>
              Put this device face up in the center. Start the narrator and have
              everyone close their eyes. When the narrator calls your starting
              role, open your eyes, pick up this device, and complete its
              action.
            </>
          }
          title="Night phase"
        />
      );
    case "calling":
      return (
        <GameStep
          actions={[
            { label: "Open night action", onClick: night.openNightAction },
          ]}
          description="When the narrator calls your starting role, privately open its action. Return this device to the center and close your eyes when finished."
          title="Waiting for the next role"
        />
      );
    case "acting": {
      const { invocation } = state;
      // The mapped type above guarantees that every key's component accepts
      // the invocation carrying that same role.
      const RoleAction = nightRoleComponents[invocation.role] as ComponentType<
        RoleNightActionProps<typeof invocation.role>
      >;
      const invocationKey = `${invocation.stageIndex}-${invocation.role}-${invocation.actorIndex}`;
      return (
        <RoleAction game={night} invocation={invocation} key={invocationKey} />
      );
    }
    case "complete":
      return (
        <GameStep
          actions={[{ label: "Continue", onClick: night.finishNight }]}
          description="The night is over. Everyone may open their eyes. Continue to any private artifact reveals before discussion."
          title="Night complete"
        />
      );
  }
}
