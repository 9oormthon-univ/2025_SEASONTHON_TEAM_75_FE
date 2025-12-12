import { useState } from "react";
import * as U from "@routes/partner/UsageStyle";
import Header from "@components/Header";
import NoHistoryIcon from "@assets/history_zero.svg";
import CouponCard from "@components/partner/CouponCard";
import { HistoryPageSkeleton } from "@components/history/Skeleton";
import DummyImg from "../../../public/app_logo.svg";
import type { UserCoupon } from "@types";

const Usage = () => {
  const DUMMY_DATA: UserCoupon[] = [
    {
      id: 1,
      profile: null,
      title: "[오프라인] 공방 10% 할인쿠폰",
      userName: "꽃돌이",
      userId: 111111,
    },
    {
      id: 2,
      profile: DummyImg,
      title: "[오프라인] 공방 20% 할인쿠폰",
      userName: "지구지킴이",
      userId: 222222,
    },
  ];

  const couponItems = DUMMY_DATA;
  const [isLoading, setIsLoading] = useState(false);
  const couponCount = couponItems.length;

  return (
    <U.Container>
      <Header title={"쿠폰 사용 현황"} isBackButton={true} isBorder={true} />
      {isLoading ? (
        <HistoryPageSkeleton />
      ) : (
        <>
          <U.SubHeader>
            <U.CouponCount>총 {couponCount}개</U.CouponCount>
          </U.SubHeader>
          {couponCount === 0 ? (
            <U.NoCouponBox>
              <img src={NoHistoryIcon} alt="기록 없음" />
              아직 사용된 쿠폰이 없어요
            </U.NoCouponBox>
          ) : (
            <U.CardWrapper>
              {couponItems.map((item) => (
                <CouponCard key={item.id} item={item} />
              ))}
            </U.CardWrapper>
          )}
        </>
      )}
    </U.Container>
  );
};
export default Usage;
