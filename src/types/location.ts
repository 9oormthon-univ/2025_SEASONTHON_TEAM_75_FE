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
