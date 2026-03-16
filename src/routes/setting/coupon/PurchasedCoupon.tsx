import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as C from "./PurchasedCouponStyle";
import Header from "@components/Header";
import NoCouponIcon from "@assets/history_zero.svg";
import CouponCard from "@components/setting/coupon/CouponCard";
import apiClient from "@utils/apiClient";
import type { SettingsUserCoupon } from "@types";

const PurchasedCoupon = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<SettingsUserCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await apiClient.get<{ data: SettingsUserCoupon[] }>("/api/v1/my/coupons");
        setCoupons(result.data?.data ?? []);
      } catch (e) {
        console.error("쿠폰 가져오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    })();
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
              key={coupon.userCouponId}
              imageUrl={coupon.partnerImageUrl}
              title={coupon.couponTitle}
              purchasedAt={coupon.purchasedAt}
              couponType={coupon.couponType}
              isUsed={coupon.couponStatus === "USED"}
              onClick={() => navigate(`/coupon/${coupon.userCouponId}`, { state: { coupon } })}
            />
          ))}
        </C.CardWrapper>
      )}
    </C.Container>
  );
};

export default PurchasedCoupon;
