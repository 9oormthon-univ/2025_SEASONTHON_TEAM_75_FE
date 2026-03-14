// 유저 정보 응답
export interface UserInfo {
  userId: number;
  nickName: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: UserInfo;
}

// 포인트
export interface UserPoint {
  userPointId: number;
  totalPoint: number;
  createAt: string;
  updateAt: string;
}

// 뱃지
export interface Badge {
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  ruleTypeDescription: string;
  earnedAt: string;
}
