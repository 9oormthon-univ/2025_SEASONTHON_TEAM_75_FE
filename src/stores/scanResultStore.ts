import { create } from "zustand";
import apiClient from "@utils/apiClient";

export interface TrashPart {
  name: string;
  typeCode: string;
  typeName: string;
}

export interface Location {
  id: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
}

export interface ApiScanResult {
  id: number;
  imageUrl: string;
  name: string;
  summary: string;
  itemName: string;
  typeCode: string;
  typeName: string;
  guideSteps: string[];
  cautionNote: string | null;
  parts: TrashPart[];
  createdAt: string;
  location?: Location;
  days?: string[];
}

interface ScanResultState {
  resultsById: { [key: number]: ApiScanResult };
  currentResult: ApiScanResult | null;
  setResultFromNavigation: (result: ApiScanResult) => void;
  fetchResultById: (id: number) => Promise<void>;
  clearCurrentResult: () => void;
  updateCurrentResult: (newResult: ApiScanResult) => void;
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
      const response = await apiClient.get<{ data: ApiScanResult }>(
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
