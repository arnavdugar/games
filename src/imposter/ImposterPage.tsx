import { Redirect, Route, Switch } from "wouter-preact";
import { GamePage } from "../common/components/GamePage";
import { useGameNavigation } from "../common/hooks/useGameNavigation";
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
  const { resetGame, startGame } = useGameNavigation({
    isInProgress: gameIsInProgress,
    isSetup: game.phase === GamePhase.Setup,
    onReset: game.resetGame,
    onStart: game.startGame,
  });

  const page = {
    [GamePhase.Setup]: <SetupPage onStart={startGame} />,
    [GamePhase.Roles]: <RolePage />,
    [GamePhase.Clues]: <CluePage />,
    [GamePhase.Discussion]: <DiscussionPage />,
    [GamePhase.Voting]: <VotingPage />,
    [GamePhase.Reveal]: <RevealPage />,
  }[game.phase];

  return (
    <GamePage onReset={resetGame} showReset={gameIsInProgress} title="Imposter">
      {page}
    </GamePage>
  );
}

export function ImposterPage() {
  return (
    <GameProvider>
      <Switch>
        <Route path="/" component={ImposterGame} />
        <Route path="/play" component={ImposterGame} />
        <Route>
          <Redirect to="/" replace />
        </Route>
      </Switch>
    </GameProvider>
  );
}
