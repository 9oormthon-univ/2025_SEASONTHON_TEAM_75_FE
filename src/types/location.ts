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
