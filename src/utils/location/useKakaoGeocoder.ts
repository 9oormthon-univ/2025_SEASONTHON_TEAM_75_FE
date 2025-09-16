import { useEffect, useMemo, useState } from "react";
import { waitKakao } from "@utils/kakao";
import type { GeocoderLike } from "@types";

let geocoderPromise: Promise<GeocoderLike> | null = null;

// Kakao Geocoder 인스턴스 반환
async function getGeocoder(): Promise<GeocoderLike> {
  if (geocoderPromise) return geocoderPromise;
  geocoderPromise = (async () => {
    await waitKakao();
    const w = window as unknown as {
      kakao?: { maps?: { services?: { Geocoder: new () => GeocoderLike } } };
    };
    const svc = w.kakao?.maps?.services;
    if (!svc?.Geocoder) throw new Error("Kakao services not available");
    return new svc.Geocoder() as GeocoderLike;
  })();
  return geocoderPromise;
}

export function useKakaoGeocoder() {
  const [geocoder, setGeocoder] = useState<GeocoderLike | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getGeocoder()
      .then((g) => mounted && setGeocoder(g))
      .catch((e) => mounted && setError(e.message ?? String(e)));
    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(
    () => ({ geocoder, ready: !!geocoder, error }),
    [geocoder, error]
  );
}
