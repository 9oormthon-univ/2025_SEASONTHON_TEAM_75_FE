import { create } from "zustand";

export interface ApiHistoryItem {
  id: number;
  imageUrl: string;
  name: string;
  summary: string;
  itemName: string | null;
  typeCode: string;
  typeName: string;
  guideSteps: string[];
  cautionNote: string | null;
  parts: any[];
  createdAt: string;
}

export interface HistoryItem {
  id: number;
  type: string;
  name: string;
}

interface HistoryState {
  historyItems: HistoryItem[];
  setHistoryItems: (items: ApiHistoryItem[]) => void;
  deleteHistoryItems: (idsToDelete: number[]) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  historyItems: [],

  setHistoryItems: (items) => {
    const mappedData = items.map((item) => ({
      id: item.id,
      type: item.typeCode,
      name: item.itemName || item.name,
    }));
    set({ historyItems: mappedData });
  },

  deleteHistoryItems: (idsToDelete) =>
    set((state) => ({
      historyItems: state.historyItems.filter(
        (item) => !idsToDelete.includes(item.id)
      ),
    })),
}));
