import { GamePage } from "../common/components/GamePage";
import { DiscussionPage } from "./components/DiscussionPage";
import { NightPage } from "./components/NightPage";
import { RevealPage } from "./components/RevealPage";
import { RolePage } from "./components/RolePage";
import { SetupPage } from "./components/SetupPage";
import { VotingPage } from "./components/VotingPage";
import { GameProvider, useGame } from "./hooks/useGame";
import { GamePhase } from "./types";

function OneNightWerewolfGame() {
  const game = useGame();
  const gameIsInProgress =
    game.phase !== GamePhase.Setup && game.phase !== GamePhase.Reveal;

  const page = {
    [GamePhase.Setup]: <SetupPage />,
    [GamePhase.Roles]: <RolePage />,
    [GamePhase.Night]: <NightPage />,
    [GamePhase.Discussion]: <DiscussionPage />,
    [GamePhase.Voting]: <VotingPage />,
    [GamePhase.Reveal]: <RevealPage />,
  }[game.phase];

  return (
    <GamePage
      onReset={game.resetGame}
      showReset={gameIsInProgress}
      title="One Night Werewolf"
    >
      {page}
    </GamePage>
  );
}

export function OneNightWerewolfPage() {
  return (
    <GameProvider>
      <OneNightWerewolfGame />
    </GameProvider>
  );
}
