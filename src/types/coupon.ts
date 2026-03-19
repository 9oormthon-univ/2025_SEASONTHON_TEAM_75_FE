// 유저의 쿠폰
export interface UserCoupon {
  id: number;
  profile: string | null;
  title: string;
  userName: string;
  userTag: string;
}

// 쿠폰 사용 통계
export interface CouponStatistics {
  total: { count: number };
  weekly: { count: number };
  monthly: { count: number };
  daily: { count: number };
}

// 파트너 사용 쿠폰
export interface UsedCouponItem {
  UserCouponId: number;
  CouponStatusDescription: string;
  usedAt: string;
  userId: number;
  userNickName: string;
  couponId: number;
  couponTitle: string;
  couponTypeDescription: string;
  userTag: string | null;
  userProfileUrl: string | null;
}
