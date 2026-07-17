import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { Button, type ButtonVariant } from "./Button";

import * as styles from "./GameStep.css";

export interface GameStepAction {
  disabled?: boolean;
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

interface GameStepProps {
  actions: readonly [GameStepAction, ...GameStepAction[]];
  beforeTitle?: ComponentChildren;
  children?: ComponentChildren;
  description?: ComponentChildren;
  title: string;
}

export function GameStep({
  actions,
  beforeTitle,
  children,
  description,
  title,
}: GameStepProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={styles.step}>
      <div className={styles.titleRow}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        {beforeTitle != null ? (
          <div className={styles.beforeTitle}>{beforeTitle}</div>
        ) : null}
      </div>
      {description != null ? (
        <p className={styles.description}>{description}</p>
      ) : null}
      {children}
      <div className={styles.actions}>
        {actions.map(({ label, ...buttonProps }, actionIndex) => (
          <Button {...buttonProps} key={actionIndex} type="button">
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}
