import { GamePage } from "../common/components/GamePage";
import { CluePage } from "./components/CluePage";
import { DiscussionPage } from "./components/DiscussionPage";
import { RevealPage } from "./components/RevealPage";
import { RolePage } from "./components/RolePage";
import { SetupPage } from "./components/SetupPage";
import { VotingPage } from "./components/VotingPage";
import { GameProvider, useGame } from "./hooks/useGame";
import { GamePhase } from "./types";

function ImposterGame() {
  const game = useGame();
  const gameIsOver =
    game.roundResult?.winner === "civilians" ||
    game.roundResult?.winner === "imposters";
  const gameIsInProgress = game.phase !== GamePhase.Setup && !gameIsOver;

  const page = {
    [GamePhase.Setup]: <SetupPage />,
    [GamePhase.Roles]: <RolePage />,
    [GamePhase.Clues]: <CluePage />,
    [GamePhase.Discussion]: <DiscussionPage />,
    [GamePhase.Voting]: <VotingPage />,
    [GamePhase.Reveal]: <RevealPage />,
  }[game.phase];

  return (
    <GamePage
      onReset={game.resetGame}
      showReset={gameIsInProgress}
      title="Imposter"
    >
      {page}
    </GamePage>
  );
}

export function ImposterPage() {
  return (
    <GameProvider>
      <ImposterGame />
    </GameProvider>
  );
}
