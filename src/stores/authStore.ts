import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { UserInfo } from "@types";
import { useHistoryStore } from "@stores/historyStore";
import { useScanResultStore } from "@stores/scanResultStore";
import { useUserDistrictStore } from "@stores/userDistrictStore";

type AuthStatus = "loading" | "member" | "guest";

interface AuthStore {
  status: AuthStatus;
  info: UserInfo | null;
  actions: {
    checkAuth: () => Promise<AuthStatus>;
    loginWithKakao: () => void;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    withdraw: () => Promise<void>;
  };
}

const useAuthStore = create<AuthStore>((set) => ({
  status: "loading",
  info: null,

  actions: {
    checkAuth: async () => {
      try {
        const { data } = await apiClient.get<{ data: UserInfo }>(
          "/api/v1/users/me"
        );
        const user: UserInfo = {
          userId: data.data.userId,
          nickName: data.data.nickName,
          profileImageUrl: data.data.profileImageUrl,
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
        };
        set({ status: "member", info: user });
        return "member" as const;
      } catch {
        set({ status: "guest", info: null });
        return "guest" as const;
      }
    },

    loginWithKakao: () => {
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/api/v1/auth/kakao/login`;
    },

    loginAsGuest: async () => {
      try {
        await apiClient.post("/api/v1/auth/guest/login", {});
        set({ status: "guest", info: null });
      } catch (error) {
        console.error("게스트 로그인 API 호출 실패:", error);
        throw error;
      }
    },

    logout: async () => {
      try {
        await apiClient.post("/api/v1/auth/logout");
        set({ status: "guest", info: null });
        useHistoryStore.getState().clearHistory();
        useScanResultStore.getState().clearAllResults();
        useUserDistrictStore.getState().actions.clearDistricts();
      } catch (error) {
        throw error;
      }
    },

    withdraw: async () => {
      try {
        await apiClient.delete("/api/v1/users/me");
        set({ status: "guest", info: null });
        useHistoryStore.getState().clearHistory();
        useScanResultStore.getState().clearAllResults();
        useUserDistrictStore.getState().actions.clearDistricts();
      } catch (error) {
        throw error;
      }
    },
  },
}));

export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useMe = () => useAuthStore((s) => s.info);
export const useAuthActions = () => useAuthStore((s) => s.actions);
export default useAuthStore;
