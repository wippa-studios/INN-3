import { useBlocker } from "react-router-dom";

interface UseNavigationBlockerReturn {
  isBlocked: boolean;
  dismiss: () => void;
}

/**
 * Blocks browser back/forward navigation (POP actions) while in-game.
 * Intentional in-app navigation (PUSH/REPLACE) is never blocked,
 * so the Leave button and SignalR-driven redirects work normally.
 */
export const useNavigationBlocker = (): UseNavigationBlockerReturn => {
  const blocker = useBlocker(
    ({ historyAction }) => historyAction === "POP",
  );

  const dismiss = () => {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return {
    isBlocked: blocker.state === "blocked",
    dismiss,
  };
};
