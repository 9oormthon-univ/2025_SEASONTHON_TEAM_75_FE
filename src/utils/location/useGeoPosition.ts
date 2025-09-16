import type { LatLng } from "@types";
import { useEffect, useState } from "react";

const DEFAULT_CENTER: LatLng = { lat: 37.525121, lng: 126.96339 };

// 위치 사용
export function useGeoPosition() {
  const [pos, setPos] = useState<LatLng>(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }
    const id = navigator.geolocation.getCurrentPosition(
      (p: GeolocationPosition) => {
        const { latitude, longitude } = p.coords;
        setPos({ lat: latitude, lng: longitude });
      },
      (err: GeolocationPositionError) => {
        console.error("위치 접근 실패:", err);
        setError("위치 정보를 가져오는 데 실패했습니다.");
      }
    );
    return () => {
      void id;
    };
  }, []);

  return { pos, error, DEFAULT_CENTER } as const;
}
