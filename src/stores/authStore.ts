import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { UserInfo } from "@types";
import { useHistoryStore } from "@stores/historyStore";
import { useScanResultStore } from "@stores/scanResultStore";
import { useUserDistrictStore } from "@stores/userDistrictStore";

type AuthStatus = "loading" | "member" | "guest" | "partner";
type CheckAuthResult = AuthStatus | "invalid_token";

interface AuthStore {
  status: AuthStatus;
  info: UserInfo | null;
  actions: {
    checkAuth: () => Promise<CheckAuthResult>;
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
        const { data: verifyData } = await apiClient.get<{
          data: {
            role: "USER" | "GUEST" | "PARTNER";
            isTokenVerified: boolean;
          };
        }>("/api/v1/auth/verify");

        const { role, isTokenVerified } = verifyData.data;

        if (!isTokenVerified) {
          set({ status: "guest", info: null });
          return "invalid_token";
        }

        if (role === "USER") {
          const { data: userData } = await apiClient.get<{ data: UserInfo }>(
            "/api/v1/users/me"
          );

          const user: UserInfo = {
            userId: userData.data.userId,
            nickName: userData.data.nickName,
            profileImageUrl: userData.data.profileImageUrl,
            createdAt: userData.data.createdAt,
            updatedAt: userData.data.updatedAt,
          };

          set({ status: "member", info: user });
          return "member";
        } else if (role === "PARTNER") {
          // 파트너인 경우 추후 처리 추가
          set({ status: "partner", info: null });
          return "partner";
        } else {
          set({ status: "guest", info: null });
          return "guest";
        }
      } catch (error) {
        console.error("Auth verify failed:", error);
        set({ status: "guest", info: null });
        return "guest";
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
        console.log("로그아웃이 실패하여 멤버 상태를 유지합니다");
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
        console.log("탈퇴를 실패하여 멤버 상태를 유지합니다");
        throw error;
      }
    },
  },
}));

export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useMe = () => useAuthStore((s) => s.info);
export const useAuthActions = () => useAuthStore((s) => s.actions);
export default useAuthStore;
