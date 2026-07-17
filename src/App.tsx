import { Redirect, Route, Router, Switch } from "wouter-preact";
import { useHashLocation } from "wouter-preact/use-hash-location";
import { GameSessionProvider } from "./common/components/GameSessionProvider";
import { LandingPage } from "./common/components/LandingPage";
import { PwaUpdater } from "./common/components/PwaUpdater";
import { ImposterPage } from "./imposter/ImposterPage";
import { OneNightWerewolfPage } from "./onenightwerewolf/OneNightWerewolfPage";

export function App() {
  return (
    <GameSessionProvider>
      <PwaUpdater />
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/imposter" nest>
            <ImposterPage />
          </Route>
          <Route path="/one-night-werewolf" nest>
            <OneNightWerewolfPage />
          </Route>
          <Route path="/" component={LandingPage} />
          <Route>
            <Redirect to="/" replace />
          </Route>
        </Switch>
      </Router>
    </GameSessionProvider>
  );
}
