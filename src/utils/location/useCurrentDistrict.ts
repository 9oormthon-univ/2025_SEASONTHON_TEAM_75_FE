import type { SetDistrictResult } from "@types";
import { useCallback, useState } from "react";
import { getCurrentPosition } from "./districtService";
import { useReverseGeocode } from "./useReverseGeocode";

export function useCurrentDistrict() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    reverse,
    loading: reverseLoading,
    error: reverseError,
  } = useReverseGeocode();

  const resolveCurrentDistrict =
    useCallback(async (): Promise<SetDistrictResult | null> => {
      setLoading(true);
      setError(null);

      try {
        // 현재 좌표
        const pos = await getCurrentPosition();
        const { latitude, longitude } = pos.coords;

        // 좌표 -> 법정동 코드/주소
        const info = await reverse(latitude, longitude);
        if (!info.bcode) {
          throw new Error("법정동 코드(bcode)를 찾지 못했습니다.");
        }

        const label = [info.sido, info.sigungu, info.eupmyeondong]
          .filter(Boolean)
          .join(" ");

        return {
          ok: true,
          label,
          districtId: info.bcode,
          sigCode: info.bcode.slice(0, 5),
        };
      } catch (error) {
        console.error("현재 위치로 자치구 설정 실패:", error);
        return null;
      }
    }, [reverse]);

  return {
    resolveCurrentDistrict,
    loading: loading || reverseLoading,
    error: error ?? reverseError,
  };
}
