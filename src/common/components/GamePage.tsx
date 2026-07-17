import type { ComponentChildren } from "preact";
import { resetGameMessage } from "../hooks/useGameNavigation";
import { PageLayout } from "./PageLayout";

import * as styles from "./GamePage.css";

interface GamePageProps {
  children: ComponentChildren;
  onReset: () => void;
  showReset: boolean;
  title: string;
}

export function GamePage({
  children,
  onReset,
  showReset,
  title,
}: GamePageProps) {
  const confirmResetGame = () => {
    if (window.confirm(resetGameMessage)) {
      onReset();
    }
  };

  return (
    <PageLayout
      documentTitle={`${title} · Pocket Games`}
      leadingAction={
        showReset
          ? { ariaLabel: "Reset game", onClick: confirmResetGame }
          : { ariaLabel: "Back to games", href: "~/" }
      }
      title={title}
    >
      <div className={styles.page}>{children}</div>
    </PageLayout>
  );
}
