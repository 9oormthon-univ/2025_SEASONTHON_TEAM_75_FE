// 지역
export interface TrashLocation {
  id: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
}

// 쓰레기 부품
export interface TrashPart {
  name: string;
  typeCode: string;
  typeName: string;
}

// 유사, 주의 품목
export interface SimilarTrashItem {
  trashItemId: number;
  itemName: string;
  typeName: string;
}

// 쓰레기 상세 정보
export interface ApiTrashDetail {
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
  location?: TrashLocation;
  days?: string[];
}

// 히스토리 아이템
export interface HistoryItem {
  id: number;
  type: string;
  name: string;
}
