import { create } from "zustand";
import type { ApiTrashDetail, HistoryItem } from "@types";

interface HistoryState {
  historyItems: HistoryItem[];
  setHistoryItems: (items: ApiTrashDetail[]) => void;
  deleteHistoryItems: (idsToDelete: number[]) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  historyItems: [],

  setHistoryItems: (items) => {
    const mappedData = items.map((item) => ({
      id: item.id,
      type: item.typeCode,
      name: item.name,
    }));
    set({ historyItems: mappedData });
  },

  deleteHistoryItems: (idsToDelete) =>
    set((state) => ({
      historyItems: state.historyItems.filter(
        (item) => !idsToDelete.includes(item.id)
      ),
    })),

  clearHistory: () => set({ historyItems: [] }),
}));
