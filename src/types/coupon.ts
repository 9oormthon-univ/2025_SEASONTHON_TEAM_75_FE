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
export interface UserCoupon {
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
