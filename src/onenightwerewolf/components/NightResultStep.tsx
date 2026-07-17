import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { GameStep } from "../../common/components/GameStep";
import { centerLabel } from "../center";
import type { NightInvocation, NightReveal } from "../types";
import { RoleBadge } from "./RoleBadge";

import * as styles from "./NightResultStep.css";

export function RevealList({ reveals }: { reveals: NightReveal[] }) {
  if (reveals.length === 0) return null;
  return (
    <ul className={styles.revealList}>
      {reveals.map((reveal, index) => {
        const label = (() => {
          switch (reveal.kind) {
            case "player":
              return reveal.playerName;
            case "center":
              return centerLabel(reveal.centerSlot);
            case "copied-role":
              return "Your copied role";
            case "new-role":
              return "Your new role";
            case "current-role":
              return "Your current role";
          }
        })();
        return (
          <li className={styles.revealCard} key={`${reveal.kind}-${index}`}>
            <span className={styles.revealLabel}>{label}</span>
            <RoleBadge role={reveal.role} />
          </li>
        );
      })}
    </ul>
  );
}

export function NightResultStep({
  description,
  finishNightAction,
  invocation,
  presentation,
  reveals = [],
}: {
  description: ComponentChildren;
  finishNightAction: () => void;
  invocation: NightInvocation;
  presentation: "action" | "memorize" | "public";
  reveals?: NightReveal[];
}) {
  useEffect(() => window.scrollTo(0, 0), []);
  const displayRole = invocation.isDoppelgangerCopy
    ? "doppelganger"
    : invocation.role;
  const title = (() => {
    switch (presentation) {
      case "action":
        return "Night action complete";
      case "memorize":
        return "Memorize this";
      case "public":
        return "Public reveal";
    }
  })();
  return (
    <GameStep
      actions={[
        {
          label: "Hide and return this device",
          onClick: finishNightAction,
        },
      ]}
      beforeTitle={<RoleBadge role={displayRole} />}
      description={description}
      title={title}
    >
      <RevealList reveals={reveals} />
    </GameStep>
  );
}
