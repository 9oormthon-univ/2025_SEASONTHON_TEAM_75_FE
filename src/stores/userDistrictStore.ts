// stores/useUserDistrictStore.ts
import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { Location, UserDistrict } from "@types";
import type {
  RegionCodeResultLike,
  AddressResultLike,
  GeocoderLike,
  ReverseRegion,
} from "@types";

interface UserDistrictState {
  districts: UserDistrict[];
  defaultDistrict: Location | null;
  actions: {
    fetchDistricts: () => Promise<void>;

    // 디폴트 변경
    changeDefault: (userDistrictId: number) => Promise<void>;

    // 현재 위치 설정
    setCurrentDistrict: () => Promise<{
      label: string;
      districtId: string; // 법정동 코드 (bcode)
      sigCode: string; // 시군구 코드 (앞 5자리)
    } | null>;

    // 자치구 설정
    setDistrict: (district: Location) => Promise<{
      label: string;
      districtId: string; // bcode
      sigCode: string;
    } | null>;

    // 자치구 삭제
    removeDistrict: (userDistrictId: number) => Promise<void>;
  };
}

function getGeocoder(): GeocoderLike | null {
  const w = window as unknown as {
    kakao?: { maps?: { services?: { Geocoder: new () => GeocoderLike } } };
  };
  if (!w.kakao?.maps?.services) return null;
  return new w.kakao.maps.services.Geocoder();
}

function getCurrentPosition(): Promise<GeolocationPosition> {
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

async function reverseFromCoord(
  lat: number,
  lng: number
): Promise<ReverseRegion> {
  const geocoder = getGeocoder();
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

const useUserDistrictStore = create<UserDistrictState>((set) => ({
  districts: [],
  defaultDistrict: null,

  actions: {
    fetchDistricts: async () => {
      try {
        const response = await apiClient.get<{ data: UserDistrict[] }>(
          "/api/v1/users/my/districts"
        );
        const fetchedDistricts = response.data.data || [];
        const newDefault =
          fetchedDistricts.find((d) => d.isDefault)?.response ||
          fetchedDistricts[0]?.response ||
          null;

        set({
          districts: fetchedDistricts,
          defaultDistrict: newDefault,
        });
      } catch (error) {
        console.error("자치구 목록 조회에 실패했습니다.", error);
        set({ districts: [], defaultDistrict: null });
      }
    },

    changeDefault: async (userDistrictId: number) => {
      try {
        const response = await apiClient.patch<{ data: UserDistrict[] }>(
          `/api/v1/users/my/districts/${userDistrictId}`
        );
        const updatedDistricts = response.data.data || [];
        const newDefault =
          updatedDistricts.find((d) => d.isDefault)?.response ||
          updatedDistricts[0]?.response ||
          null;

        set({
          districts: updatedDistricts,
          defaultDistrict: newDefault,
        });
      } catch (error) {
        console.error("기본 자치구 변경에 실패했습니다.", error);
      }
    },

    setCurrentDistrict: async () => {
      try {
        // 현재 좌표
        const pos = await getCurrentPosition();
        const { latitude, longitude } = pos.coords;

        // 좌표 -> 법정동 코드/주소
        const info = await reverseFromCoord(latitude, longitude);
        if (!info.bcode) {
          console.error("법정동 코드(bcode)를 찾지 못했습니다.", info);
          return null;
        }

        const label =
          info.addressName ??
          [info.sido, info.sigungu, info.eupmyeondong]
            .filter(Boolean)
            .join(" ");

        return {
          label,
          districtId: info.bcode,
          sigCode: info.bcode.slice(0, 5),
        };
      } catch (error) {
        console.error("현재 위치로 자치구 설정 실패:", error);
        return null;
      }
    },

    setDistrict: async (district) => {
      try {
        // 서버 등록
        const response = await apiClient.post(
          `/api/v1/users/districts/${district.districtId}`
        );

        const updatedDistricts = response.data.data || [];
        const newDefault =
          updatedDistricts.find((d: UserDistrict) => d.isDefault)?.response ||
          updatedDistricts[0]?.response ||
          null;

        const label = [district.sido, district.sigugn, district.eupmyeondong]
          .filter(Boolean)
          .join(" ");

        set({
          districts: updatedDistricts,
          defaultDistrict: newDefault,
        });

        return {
          label,
          districtId: district.districtId,
          sigCode: district.districtId.slice(0, 5),
        };
      } catch (error) {
        console.error("자치구 등록 실패:", error);
        return null;
      }
    },

    removeDistrict: async (userDistrictId: number) => {
      try {
        const res = await apiClient.delete<{ data: UserDistrict[] }>(
          `/api/v1/users/districts/${userDistrictId}`
        );

        const updatedDistricts: UserDistrict[] = res.data.data ?? [];

        const newDefault: Location | null =
          updatedDistricts.find((d) => d.isDefault)?.response ??
          updatedDistricts[0]?.response ??
          null;

        set({
          districts: updatedDistricts,
          defaultDistrict: newDefault,
        });
      } catch (error) {
        console.error("자치구 삭제에 실패했습니다.", error);
      }
    },
  },
}));

export const useDistricts = () => useUserDistrictStore((s) => s.districts);
export const useDefaultDistrict = () =>
  useUserDistrictStore((s) => s.defaultDistrict);
export const useDistrictActions = () => useUserDistrictStore((s) => s.actions);
export default useUserDistrictStore;
