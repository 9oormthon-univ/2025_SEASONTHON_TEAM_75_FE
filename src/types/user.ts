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
