import { GameStep } from "../../common/components/GameStep";
import { useGame } from "../hooks/useGame";
import { ClueHistory } from "./ClueHistory";

import * as styles from "./DiscussionPage.css";

export function DiscussionPage() {
  const game = useGame();

  return (
    <GameStep
      actions={[
        { label: "Start hidden voting", onClick: game.startVoting },
        {
          label: "Take another clue round",
          onClick: game.continueGame,
          variant: "secondary",
        },
      ]}
      description="Compare wording, timing, and repeated ideas before anyone votes."
      title="Discuss the clues"
    >
      <ul className={styles.playerList}>
        {game.activePlayerIndexes.map((playerIndex) => {
          const player = game.players[playerIndex];
          return (
            <li className={styles.playerCard} key={playerIndex}>
              <ClueHistory
                clues={game.clues[playerIndex] ?? []}
                name={player.name}
              />
            </li>
          );
        })}
      </ul>
    </GameStep>
  );
}
