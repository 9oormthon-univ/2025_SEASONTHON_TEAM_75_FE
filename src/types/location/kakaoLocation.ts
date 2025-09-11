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
