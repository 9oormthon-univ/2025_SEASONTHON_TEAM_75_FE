import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { Location, UserDistrict } from "@types";
import {
  getCurrentPosition,
  reverseFromCoord,
} from "@utils/location/districtService";

interface UserDistrictState {
  districts: UserDistrict[];
  defaultDistrict: Location | null;
  actions: {
    fetchDistricts: () => Promise<void>;
    changeDefault: (userDistrictId: number) => Promise<void>;
    setCurrentDistrict: () => Promise<{
      label: string;
      districtId: string; // bcode
      sigCode: string;
    } | null>;
    setDistrict: (district: Location) => Promise<{
      label: string;
      districtId: string; // bcode
      sigCode: string;
    } | null>;
    removeDistrict: (userDistrictId: number) => Promise<void>;
    setGuestDistrict: (district: Location | null) => void;
    clearDistricts: () => void;
  };
}

export const useUserDistrictStore = create<UserDistrictState>((set) => ({
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
          `/api/v1/users/districts/${userDistrictId}`
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

        const label = [info.sido, info.sigungu, info.eupmyeondong]
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

    clearDistricts: () => {
      set({ districts: [], defaultDistrict: null });
    },

    setGuestDistrict: (district) => {
      // 게스트 설정 시, 회원 데이터는 없어야 하므로 함께 초기화
      set({
        districts: [],
        defaultDistrict: district,
      });
    },
  },
}));

export const useDistricts = () => useUserDistrictStore((s) => s.districts);
export const useDefaultDistrict = () =>
  useUserDistrictStore((s) => s.defaultDistrict);
export const useDistrictActions = () => useUserDistrictStore((s) => s.actions);
export default useUserDistrictStore;
