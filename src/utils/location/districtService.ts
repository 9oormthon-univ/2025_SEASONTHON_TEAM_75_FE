import { useLocation } from "react-router-dom";
import type {
  RegionCodeResultLike,
  AddressResultLike,
  GeocoderLike,
  ReverseRegion,
  GeoJSONGeometry,
  LatLng,
  LocationState,
} from "@types";
import { waitKakao } from "@utils/kakao";
import { useCallback, useEffect, useRef, useState } from "react";

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
    if (!svc?.Geocoder) {
      throw new Error("Kakao services not available");
    }
    return new svc.Geocoder() as GeocoderLike;
  })();

  return geocoderPromise;
}

// 현재 위치 반환
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Geolocation를 지원하지 않습니다."));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });
}

// 위/경도로 주소, 법정코드 조회
export async function reverseFromCoord(
  lat: number,
  lng: number
): Promise<ReverseRegion> {
  const geocoder = await getGeocoder();
  if (!geocoder) throw new Error("카카오 지오코더가 아직 로드되지 않았습니다.");

  // 법정/행정 코드
  const region = await new Promise<RegionCodeResultLike[]>((res, rej) => {
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === "OK") res(result);
      else rej(new Error("coord2RegionCode 실패: " + status));
    });
  });

  const legal = region.find((r) => r.region_type === "B"); // 법정동

  // 지번/도로명 주소
  const addr = await new Promise<AddressResultLike[]>((res, rej) => {
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === "OK") res(result);
      else rej(new Error("coord2Address 실패: " + status));
    });
  });

  const jibun = addr.find((a) => a.address)?.address ?? undefined;

  // 시/구/동
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
}

// 지도 좌표 변환
type LngLat = [number, number];
type LinearRing = LngLat[];
type PolygonCoords = LinearRing[];
type MultiPolygonCoords = PolygonCoords[];

export function toLatLngPaths(geometry: GeoJSONGeometry): LatLng[][] {
  const polygons: MultiPolygonCoords =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons.flatMap((rings: PolygonCoords) =>
    rings.map((ring: LinearRing) =>
      ring.map(([lng, lat]: LngLat) => ({ lat, lng }))
    )
  );
}

export function useQueryLocationState() {
  const { state } = useLocation() as { state: LocationState };
  const isFromSearch: boolean = state?.source === "location_search";
  return {
    isFromSearch,
    setup: isFromSearch && !!state?.setup,
    selectedTitleFromQuery: isFromSearch ? state?.selected : undefined,
    sigCodeFromQuery: isFromSearch ? state?.sigCode : undefined,
    districtIdFromQuery: isFromSearch ? state?.districtId : undefined,
  } as const;
}

// 위치 사용
const DEFAULT_CENTER: LatLng = { lat: 37.525121, lng: 126.96339 };

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
    // clean-up 함수에서는 id를 직접 사용할 수 없으므로 void 처리합니다.
    return () => {
      void id;
    };
  }, []);

  return { pos, error, DEFAULT_CENTER } as const;
}

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
