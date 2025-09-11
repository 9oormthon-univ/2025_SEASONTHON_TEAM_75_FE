import { create } from "zustand";
import apiClient from "@utils/apiClient";
import type { ApiTrashDetail } from "@types";

interface ScanResultState {
  resultsById: { [key: number]: ApiTrashDetail };
  currentResult: ApiTrashDetail | null;
  setResultFromNavigation: (result: ApiTrashDetail) => void;
  fetchResultById: (id: number) => Promise<void>;
  clearCurrentResult: () => void;
  updateCurrentResult: (newResult: ApiTrashDetail) => void;
}

export const useScanResultStore = create<ScanResultState>((set, get) => ({
  resultsById: {},
  currentResult: null,

  setResultFromNavigation: (result) => {
    set((state) => ({
      resultsById: { ...state.resultsById, [result.id]: result },
      currentResult: result,
    }));
  },

  fetchResultById: async (id) => {
    const cachedResult = get().resultsById[id];
    if (cachedResult) {
      set({ currentResult: cachedResult });
    }
    try {
      const response = await apiClient.get<{ data: ApiTrashDetail }>(
        `/api/v1/trash/${id}`
      );
      const result = response.data.data;
      set((state) => ({
        resultsById: { ...state.resultsById, [id]: result },
        currentResult: result,
      }));
    } catch (err) {
      console.error("최신 스캔 정보를 불러오는데 실패했습니다:", err);
      if (!cachedResult) {
        set({ currentResult: null });
      }
    }
  },

  clearCurrentResult: () => {
    set({ currentResult: null });
  },

  updateCurrentResult: (newResult) => {
    set((state) => ({
      currentResult: newResult,
      resultsById: { ...state.resultsById, [newResult.id]: newResult },
    }));
  },
}));
