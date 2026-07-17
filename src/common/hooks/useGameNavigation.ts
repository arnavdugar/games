import { useEffect } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useReportGameInProgress } from "../components/GameSessionProvider";

export const resetGameMessage =
  "Reset the game? Your current game progress will be lost.";

interface UseGameNavigationOptions {
  isInProgress: boolean;
  isSetup: boolean;
  onReset: () => void;
  onStart: () => void;
}

export function useGameNavigation({
  isInProgress,
  isSetup,
  onReset,
  onStart,
}: UseGameNavigationOptions) {
  const [location, navigate] = useLocation();
  useReportGameInProgress(isInProgress);

  const resetGame = () => {
    onReset();
    navigate("/", { replace: true });
  };

  const startGame = () => {
    onStart();
    navigate("/play");
  };

  useEffect(() => {
    if (isSetup && location !== "/") {
      navigate("/", { replace: true });
    } else if (!isSetup && !isInProgress && location === "/") {
      onReset();
    }
  }, [isInProgress, isSetup, location, navigate, onReset]);

  useEffect(() => {
    if (!isInProgress) return;

    const handleHistoryNavigation = () => {
      if (window.confirm(resetGameMessage)) {
        resetGame();
      } else {
        navigate(location);
      }
    };

    window.addEventListener("popstate", handleHistoryNavigation);
    return () =>
      window.removeEventListener("popstate", handleHistoryNavigation);
  }, [isInProgress, location, navigate, resetGame]);

  return { resetGame, startGame };
}
