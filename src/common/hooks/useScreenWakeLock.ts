import { useCallback, useEffect, useRef } from "preact/hooks";

export function useScreenWakeLock() {
  const isSupported =
    typeof navigator !== "undefined" && "wakeLock" in navigator;
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const wantsWakeLockRef = useRef(false);
  const requestPendingRef = useRef(false);

  const requestWakeLock = useCallback(async () => {
    wantsWakeLockRef.current = true;
    if (!isSupported || wakeLockRef.current || requestPendingRef.current)
      return;

    requestPendingRef.current = true;
    try {
      const wakeLock = await navigator.wakeLock.request("screen");
      if (!wantsWakeLockRef.current) {
        await wakeLock.release();
        return;
      }

      wakeLockRef.current = wakeLock;
      wakeLock.addEventListener("release", () => {
        if (wakeLockRef.current === wakeLock) wakeLockRef.current = null;
      });
    } catch {
      wantsWakeLockRef.current = false;
    } finally {
      requestPendingRef.current = false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    wantsWakeLockRef.current = false;
    const wakeLock = wakeLockRef.current;
    wakeLockRef.current = null;
    if (wakeLock) await wakeLock.release();
  }, []);

  useEffect(() => {
    const restoreWakeLock = () => {
      if (document.visibilityState === "visible" && wantsWakeLockRef.current) {
        void requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", restoreWakeLock);
    return () => {
      document.removeEventListener("visibilitychange", restoreWakeLock);
      wantsWakeLockRef.current = false;
      const wakeLock = wakeLockRef.current;
      wakeLockRef.current = null;
      if (wakeLock) void wakeLock.release();
    };
  }, [requestWakeLock]);

  return { releaseWakeLock, requestWakeLock };
}
