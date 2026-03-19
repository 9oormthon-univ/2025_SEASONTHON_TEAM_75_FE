import { useEffect, useState } from "react";
import * as U from "@routes/partner/UsageStyle";
import Header from "@components/Header";
import NoHistoryIcon from "@assets/history_zero.svg";
import CouponCard from "@components/partner/CouponCard";
import { HistoryPageSkeleton } from "@components/history/Skeleton";
import apiClient from "@utils/apiClient";
import type { UsedCouponItem } from "@types";

const Usage = () => {
  const [couponItems, setCouponItems] = useState<UsedCouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsedCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: UsedCouponItem[] }>(
        "/api/v1/partner/coupons/used",
      );
      setCouponItems(response.data.data);
    } catch (error) {
      console.error("사용한 쿠폰 목록을 불러오는 데 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsedCoupons();
  }, []);

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
                <CouponCard
                  key={item.UserCouponId}
                  item={{
                    id: item.UserCouponId,
                    title: item.couponTitle,
                    userName: item.userNickName,
                    userTag: item.userTag ?? "",
                    profile: item.userProfileUrl,
                  }}
                />
              ))}
            </U.CardWrapper>
          )}
        </>
      )}
    </U.Container>
  );
};
export default Usage;
