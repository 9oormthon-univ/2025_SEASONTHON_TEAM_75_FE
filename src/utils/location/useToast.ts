import { useCallback, useEffect, useRef, useState } from "react";

// 토스트 메시지
export function useToast(duration = 2000) {
  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const pushToast = useCallback(
    (title: string) => {
      setToastTitle(title);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setToastTitle(null);
        timerRef.current = null;
      }, duration);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastTitle, pushToast };
}
