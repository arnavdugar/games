import { Redirect, Route, Switch } from "wouter-preact";
import { GamePage } from "../common/components/GamePage";
import { useGameNavigation } from "../common/hooks/useGameNavigation";
import { ArtifactPage } from "./components/ArtifactPage";
import { DiscussionPage } from "./components/DiscussionPage";
import { NightPage } from "./components/NightPage";
import { RevealPage } from "./components/RevealPage";
import { RolePage } from "./components/RolePage";
import { SetupPage } from "./components/SetupPage";
import { VotingPage } from "./components/VotingPage";
import { GameProvider, useGame } from "./hooks/useGame";

function OneNightWerewolfGame() {
  const game = useGame();
  const phase = game.state.phase;
  const gameIsInProgress = phase !== "setup" && phase !== "reveal";
  const { resetGame, startGame } = useGameNavigation({
    isInProgress: gameIsInProgress,
    isSetup: phase === "setup",
    onReset: game.resetGame,
    onStart: game.setup.startGame,
  });

  const page = {
    setup: <SetupPage onStart={startGame} />,
    roles: <RolePage />,
    night: <NightPage />,
    artifacts: <ArtifactPage />,
    discussion: <DiscussionPage />,
    voting: <VotingPage />,
    reveal: <RevealPage />,
  }[phase];

  return (
    <GamePage
      onReset={resetGame}
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
      <Switch>
        <Route path="/" component={OneNightWerewolfGame} />
        <Route path="/play" component={OneNightWerewolfGame} />
        <Route>
          <Redirect to="/" replace />
        </Route>
      </Switch>
    </GameProvider>
  );
}
