import { useEffect } from "preact/hooks";
import { useRegisterSW } from "virtual:pwa-register/preact";
import { useGameIsInProgress } from "./GameSessionProvider";

export function PwaUpdater() {
  const gameIsInProgress = useGameIsInProgress();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh && !gameIsInProgress) {
      void updateServiceWorker();
    }
  }, [gameIsInProgress, needRefresh, updateServiceWorker]);

  return null;
}
