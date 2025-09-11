let kakaoReadyPromise: Promise<void> | null = null;

export function waitKakao(timeoutMs = 10000): Promise<void> {
  if (typeof window === "undefined")
    return Promise.reject(new Error("no-window"));

  // 준비 완료
  if (window.kakao?.maps?.services) return Promise.resolve();

  // 진행 중 Promise 재사용
  if (kakaoReadyPromise) return kakaoReadyPromise;

  kakaoReadyPromise = new Promise<void>((resolve, reject) => {
    const started = Date.now();
    const iv = setInterval(() => {
      if (window.kakao?.maps?.services) {
        clearInterval(iv);
        resolve();
      } else if (Date.now() - started > timeoutMs) {
        clearInterval(iv);
        reject(new Error("Kakao Maps SDK load timeout"));
      }
    }, 50);
  });

  return kakaoReadyPromise;
}
