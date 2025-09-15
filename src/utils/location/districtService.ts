import type {
  RegionCodeResultLike,
  AddressResultLike,
  GeocoderLike,
  ReverseRegion,
} from "@types";
import { waitKakao } from "@utils/kakao";

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
