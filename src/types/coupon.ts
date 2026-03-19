// 포인트 상점 쿠폰
export interface StoreCoupon {
  couponId: number;
  title: string;
  couponType: "ONLINE" | "OFFLINE";
  pointCost: number;
  createAt: string;
  updateAt: string;
  partnerResponse: {
    partnerId: number;
    partnerName: string;
    address: string;
    description: string;
    imageUrl: string;
  };
}

// 쿠폰 구매 응답
export interface PurchaseResult {
  userCouponId: number;
  couponId: number;
  couponTitle: string;
  pointsUsed: number;
  purchasedAt: string;
  qrImageUrl: string;
}

// 포인트 상점 쿠폰 상세
export interface StoreCouponDetail {
  couponId: number;
  title: string;
  content: string;
  couponType: string;
  pointCost: number;
  createAt: string;
  updateAt: string;
  partnerResponse: {
    partnerId: number;
    partnerName: string;
    address: string;
    description: string;
    imageUrl: string;
  };
}

// 구매한 쿠폰 상세
export interface UserCouponDetail {
  userCouponId: number;
  couponStatus: "AVAILABLE" | "USED";
  purchasedAt: string;
  updateAt: string;
  couponId: number;
  couponTitle: string;
  couponContent: string;
  couponType: string;
  qrImageUrl: string;
  partnerName: string;
  partnerImageUrl: string;
  usedAt: string | null;
  usability: {
    status: string;
    reason: string;
  };
}

// 구매한 쿠폰
// 파트너 쿠폰 사용 현황
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

// 설정 > 구매한 쿠폰
export interface SettingsUserCoupon {
  userCouponId: number;
  couponStatus: "AVAILABLE" | "USED";
  purchasedAt: string;
  updateAt: string;
  couponId: number;
  couponTitle: string;
  couponType: "ONLINE" | "OFFLINE";
  partnerName: string;
  partnerImageUrl: string;
  usedAt: string | null;
}
