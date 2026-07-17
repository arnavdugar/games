import { Redirect, Route, Router, Switch } from "wouter-preact";
import { useHashLocation } from "wouter-preact/use-hash-location";
import { LandingPage } from "./common/components/LandingPage";
import { ImposterPage } from "./imposter/ImposterPage";
import { OneNightWerewolfPage } from "./onenightwerewolf/OneNightWerewolfPage";

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/imposter" component={ImposterPage} />
        <Route path="/one-night-werewolf" component={OneNightWerewolfPage} />
        <Route path="/" component={LandingPage} />
        <Route>
          <Redirect to="/" replace />
        </Route>
      </Switch>
    </Router>
  );
}
