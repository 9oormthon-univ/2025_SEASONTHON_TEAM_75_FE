// 랭킹 API 응답 아이템
export interface ApiRankingItem {
  rankId: number;
  trashImageUrl: string | null;
  trashTypeName: string;
  rankOrder: number;
  previousRank: number;
  totalSearchCount: number;
  previousTotalSearchCount: number;
  trendDirection: "UP" | "DOWN" | "SAME";
  trendMessage: string;
  countChange: number;
  rankChange: number;
}

// 랭킹 API 전체 응답
export interface RankingApiResponse {
  rankings: ApiRankingItem[];
  totalCount: number;
  lastUpdated: string;
}

// 랭킹 아이템 상태
export interface RankingItemData {
  rank: number;
  imageUrl: string;
  name: string;
  trendDirection: "UP" | "DOWN" | "SAME";
  searchCount: number;
}
