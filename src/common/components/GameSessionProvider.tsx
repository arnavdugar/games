import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { useScreenWakeLock } from "../hooks/useScreenWakeLock";

interface GameSessionContextValue {
  gameIsInProgress: boolean;
  setGameIsInProgress: (isInProgress: boolean) => void;
}

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

export function GameSessionProvider({
  children,
}: {
  children: ComponentChildren;
}) {
  const [gameIsInProgress, setGameIsInProgress] = useState(false);
  const { releaseWakeLock, requestWakeLock } = useScreenWakeLock();

  useEffect(() => {
    if (gameIsInProgress) {
      void requestWakeLock();
    } else {
      void releaseWakeLock();
    }
  }, [gameIsInProgress, releaseWakeLock, requestWakeLock]);

  return (
    <GameSessionContext.Provider
      value={{ gameIsInProgress, setGameIsInProgress }}
    >
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameIsInProgress() {
  const session = useContext(GameSessionContext);
  if (!session) {
    throw new Error(
      "useGameIsInProgress must be used within GameSessionProvider.",
    );
  }
  return session.gameIsInProgress;
}

export function useReportGameInProgress(gameIsInProgress: boolean) {
  const session = useContext(GameSessionContext);
  if (!session) {
    throw new Error(
      "useReportGameInProgress must be used within GameSessionProvider.",
    );
  }
  const { setGameIsInProgress } = session;

  useEffect(() => {
    setGameIsInProgress(gameIsInProgress);
    return () => setGameIsInProgress(false);
  }, [gameIsInProgress, setGameIsInProgress]);
}
