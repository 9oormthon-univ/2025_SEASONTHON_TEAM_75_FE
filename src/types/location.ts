// 자치구 정보
export interface Location {
  districtId: string;
  sido: string;
  sigugn: string;
  eupmyeondong: string;
}

// 자치구 정보 API 응답
export interface UserDistrict {
  response: Location;
  userDistrictId: number;
  isDefault: boolean;
}

// 시군구
export interface Sigungu {
  code: string;
  name: string;
}

// 자치구 설정 타입
export interface SetDistrictSuccess {
  ok: true;
  label: string;
  districtId: string;
  sigCode: string;
}
export interface SetDistrictFailure {
  ok: false;
  error: "UNSUPPORTED_REGION" | "UNKNOWN";
}
export type SetDistrictResult = SetDistrictSuccess | SetDistrictFailure;

export interface RegionCodeResultLike {
  region_type: "B" | "H";
  code: string;
  address_name: string;
}

export interface JibunLike {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  main_address_no: string;
  sub_address_no?: string | null;
}

export interface AddressResultLike {
  address?: JibunLike | null;
}

export interface GeocoderLike {
  coord2RegionCode: (
    lng: number,
    lat: number,
    cb: (result: RegionCodeResultLike[], status: string) => void
  ) => void;
  coord2Address: (
    lng: number,
    lat: number,
    cb: (result: AddressResultLike[], status: string) => void
  ) => void;
}

// 역지오코딩 결과
export interface ReverseRegion {
  bcode?: string; // 법정동 코드
  hcode?: string; // 행정동 코드
  addressName?: string; // 전체 주소
  sido?: string;
  sigungu?: string;
  eupmyeondong?: string;
  jibunAddress?: string; // 지번 전체 주소
  roadAddress?: string; // 도로명 전체 주소
}

// GeoJSON
type LngLat = [number, number];
type LinearRing = LngLat[]; // 폐곡선 1개
type PolygonCoords = LinearRing[]; // 외곽 1개 + 홀 n개
type MultiPolygonCoords = PolygonCoords[]; // 폴리곤 n개

export type GeoJSONGeometry =
  | { type: "Polygon"; coordinates: PolygonCoords }
  | { type: "MultiPolygon"; coordinates: MultiPolygonCoords };

export interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: { SIG_CD: string; SIG_KOR_NM: string };
}

export interface GeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// 위도, 경도
export interface LatLng {
  lat: number;
  lng: number;
}

// 라우팅 state
export type LocationState = {
  source?: "location_search";
  setup?: boolean;
  selected?: string;
  sigCode?: string;
  districtId?: string;
  from?: "home" | "profile_complete";
} | null;

// 내 동네 아이템 타입
export interface MyLocationItem {
  id: string | number;
  title: string;
  sigCode: string;
}

// 카카오 맵
export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface KakaoMap {
  setBounds: (bounds: any) => void;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;

        LatLngBounds: new () => {
          extend: (latlng: KakaoLatLng) => void;
          getSouthWest: () => KakaoLatLng;
          getNorthEast: () => KakaoLatLng;
        };

        services: {
          Geocoder: new () => GeocoderLike;
        };
      };
    };
  }
}
