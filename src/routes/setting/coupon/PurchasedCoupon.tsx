import { useEffect, useState } from "react";
import * as C from "./PurchasedCouponStyle";
import Header from "@components/Header";
import NoCouponIcon from "@assets/history_zero.svg";
import CouponCard from "@components/setting/coupon/CouponCard";

interface Coupon {
  id: number;
  imageUrl: string;
  title: string;
  expiresAt: string;
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    imageUrl: "https://placehold.co/44x44",
    title: "[오프라인] 공방 10% 할인쿠폰",
    expiresAt: "2026.06.30",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/44x44",
    title: "[오프라인] 공방 20% 할인쿠폰",
    expiresAt: "2026.05.15",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/44x44",
    title: "[오프라인] 공방 15% 할인쿠폰",
    expiresAt: "2025.04.01",
  },
];

const PurchasedCoupon = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 연동
    setCoupons(MOCK_COUPONS);
    setIsLoading(false);
  }, []);

  const couponCount = coupons.length;

  if (isLoading) {
    return (
      <C.Container>
        <Header title="구매한 쿠폰" isBackButton={true} isBorder={true} />
      </C.Container>
    );
  }

  return (
    <C.Container>
      <Header title="구매한 쿠폰" isBackButton={true} isBorder={true} />
      <C.SubHeader>
        <C.CouponCount>총 {couponCount}개</C.CouponCount>
      </C.SubHeader>
      {couponCount === 0 ? (
        <C.NoCouponBox>
          <img src={NoCouponIcon} alt="쿠폰 없음" />
          아직 발행된 쿠폰이 없어요
        </C.NoCouponBox>
      ) : (
        <C.CardWrapper>
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              imageUrl={coupon.imageUrl}
              title={coupon.title}
              expiresAt={coupon.expiresAt}
            />
          ))}
        </C.CardWrapper>
      )}
    </C.Container>
  );
};

export default PurchasedCoupon;
