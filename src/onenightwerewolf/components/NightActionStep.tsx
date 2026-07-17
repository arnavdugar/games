import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import {
  GameStep,
  type GameStepAction,
} from "../../common/components/GameStep";
import { isImmediateDoppelgangerRole, roleById } from "../roles";
import type { NightInvocation } from "../types";
import { RoleBadge } from "./RoleBadge";

function useSubmissionGuard(submissionKey: string | number) {
  const submission = useRef({ key: submissionKey, submitted: false });
  if (submission.current.key !== submissionKey) {
    submission.current = { key: submissionKey, submitted: false };
  }

  return (submit: () => boolean | void) => {
    if (submission.current.submitted) return false;
    submission.current.submitted = true;
    const result = submit();
    if (result === false) submission.current.submitted = false;
    return result !== false;
  };
}

type NightStepAction = Omit<GameStepAction, "onClick" | "variant"> & {
  onClick: () => boolean | void;
};

type NightStepActions = readonly [
  primaryAction: NightStepAction,
  secondaryAction?: Omit<NightStepAction, "disabled">,
];

export function NightActionStep({
  actions: [primaryAction, secondaryAction],
  children,
  instruction,
  invocation,
  submissionKey = 0,
}: {
  actions: NightStepActions;
  children?: ComponentChildren;
  instruction?: ComponentChildren;
  invocation: NightInvocation;
  submissionKey?: string | number;
}) {
  const submitOnce = useSubmissionGuard(submissionKey);
  const displayRole = invocation.isDoppelgangerCopy
    ? "doppelganger"
    : invocation.role;
  const description = (() => {
    if (instruction !== undefined) return instruction;
    const definition = roleById[invocation.role];
    if (
      !invocation.isDoppelgangerCopy ||
      !isImmediateDoppelgangerRole(invocation.role)
    ) {
      return definition.nightInstruction;
    }
    const followUp = definition.doppelgangerFollowUp;
    return (
      <>
        You copied the <strong>{definition.name}</strong>.{" "}
        {definition.nightInstruction}
        {followUp ? ` ${followUp}` : null}
      </>
    );
  })();
  const actions: [GameStepAction, ...GameStepAction[]] = [
    {
      disabled: primaryAction.disabled,
      label: primaryAction.label,
      onClick: () => submitOnce(primaryAction.onClick),
    },
  ];
  if (secondaryAction) {
    actions.push({
      label: secondaryAction.label,
      onClick: () => submitOnce(secondaryAction.onClick),
      variant: "secondary",
    });
  }

  return (
    <GameStep
      actions={actions}
      beforeTitle={<RoleBadge role={displayRole} />}
      description={description}
      title="Night action"
    >
      {children}
    </GameStep>
  );
}
