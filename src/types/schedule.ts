// 오늘의 배출 정보 API 응답
export interface ApiTrashSchedule {
  categoryName: string;
  trashTypes: string[];
  location: string;
  todayDay: string;
  todayDate: string;
}

// 배출 정보 상태
export interface ScheduleInfo {
  categories: string[];
  location: string;
  date: string;
}
