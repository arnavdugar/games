import type { ComponentChildren } from "preact";
import { PageLayout } from "./PageLayout";

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
    if (
      window.confirm("Reset the game? Your current game progress will be lost.")
    ) {
      onReset();
    }
  };

  return (
    <PageLayout
      documentTitle={`${title} · Games`}
      leadingAction={
        showReset
          ? { ariaLabel: "Reset game", onClick: confirmResetGame }
          : { ariaLabel: "Back to games", href: "/" }
      }
      title={title}
    >
      {children}
    </PageLayout>
  );
}
