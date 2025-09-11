// 최신 개정 쓰레기 목록 아이템 API 응답
export interface ApiRevisionItem {
  revisionId: number;
  subTitle: string;
  trashTypeName: string;
  revisionDate: string;
}

// 최신 개정 쓰레기 상세 정보 API 응답
export interface ApiRevisionDetail {
  revisionId: number;
  subTitle: string;
  title: string;
  content: string;
  revisionDate: string;
  trashTypeName: string;
}
