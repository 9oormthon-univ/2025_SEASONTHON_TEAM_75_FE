import { useCallback, useState } from "react";
import type {
  AddressResultLike,
  RegionCodeResultLike,
  ReverseRegion,
} from "@types";
import { useKakaoGeocoder } from "./useKakaoGeocoder";

// 위/경도로 주소, 법정코드 조회
export function useReverseGeocode() {
  const { geocoder, ready, error: geocoderError } = useKakaoGeocoder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(geocoderError ?? null);

  const reverse = useCallback(
    async (lat: number, lng: number): Promise<ReverseRegion> => {
      if (!ready || !geocoder)
        throw new Error("카카오 지오코더가 아직 로드되지 않았습니다.");

      setLoading(true);
      setError(null);

      try {
        // 법정/행정 코드
        const region = await new Promise<RegionCodeResultLike[]>((res, rej) => {
          geocoder.coord2RegionCode(lng, lat, (result, status) => {
            if (status === "OK") res(result);
            else rej(new Error("coord2RegionCode 실패: " + status));
          });
        });

        // 지번/도로명 주소
        const legal = region.find((r) => r.region_type === "B"); // 법정동
        const addr = await new Promise<AddressResultLike[]>((res, rej) => {
          geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === "OK") res(result);
            else rej(new Error("coord2Address 실패: " + status));
          });
        });

        // 시/구/동
        const jibun = addr.find((a) => a.address)?.address ?? undefined;
        const parts = (legal?.address_name ?? "").split(" ").filter(Boolean);
        const [sido, sigungu, eupmyeondong] = [parts[0], parts[1], parts[2]];

        return {
          bcode: legal?.code,
          addressName: legal?.address_name,
          sido,
          sigungu,
          eupmyeondong,
          jibunAddress: jibun
            ? `${jibun.region_1depth_name} ${jibun.region_2depth_name} ${
                jibun.region_3depth_name
              } ${jibun.main_address_no}${
                jibun.sub_address_no ? "-" + jibun.sub_address_no : ""
              }`
            : undefined,
        };
      } catch (e: unknown) {
        setError(String(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [geocoder, ready]
  );

  return { reverse, loading, error };
}
