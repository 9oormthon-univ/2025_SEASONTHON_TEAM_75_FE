import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { Location, UserDistrict } from "@types";

interface UserDistrictState {
  districts: UserDistrict[];
  defaultDistrict: Location | null;
  actions: {
    fetchDistricts: () => Promise<void>;
    changeDefault: (userDistrictId: number) => Promise<void>;
    // 등록/삭제
    // addDistrict: (someData) => Promise<void>;
    // removeDistrict: (userDistrictId) => Promise<void>;
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
  },
}));

export const useDistricts = () =>
  useUserDistrictStore((state) => state.districts);
export const useDefaultDistrict = () =>
  useUserDistrictStore((state) => state.defaultDistrict);
export const useDistrictActions = () =>
  useUserDistrictStore((state) => state.actions);
