import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as D from "./PointStoreDetailStyle";
import Header from "@components/Header";
import MainButton from "@components/MainButton";
import apiClient from "@utils/apiClient";
import type { StoreCouponDetail, PurchaseResult } from "@types";
import type { UserPoint } from "@types";

const PointStoreDetail = () => {
  const { id: couponId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<StoreCouponDetail | null>(null);
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [detailRes, pointRes] = await Promise.all([
          apiClient.get<{ data: StoreCouponDetail }>(`/api/v1/store/coupons/${couponId}`),
          apiClient.get<{ data: UserPoint }>("/api/v1/points"),
        ]);
        setItem(detailRes.data?.data ?? null);
        setTotalPoint(pointRes.data?.data?.totalPoint ?? 0);
      } catch (e) {
        console.error("상세 정보 가져오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [couponId]);

  if (isLoading || !item) {
    return (
      <D.Page>
        <Header title="포인트 상점" isBackButton={true} />
      </D.Page>
    );
  }

  const canPurchase = totalPoint >= item.pointCost;

  const handlePurchase = async () => {
    if (!item || isPurchasing) return;
    setIsPurchasing(true);
    try {
      const result = await apiClient.post<{ data: PurchaseResult }>(
        "/api/v1/store/coupons/purchase",
        { couponId: item.couponId },
      );
      navigate(`/store/${item.couponId}/success`, {
        state: { purchase: result.data?.data },
      });
    } catch (e: unknown) {
      const axiosError = e as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message ?? "구매에 실패했습니다. 다시 시도해주세요.";
      console.error("구매 실패:", axiosError?.response?.data ?? e);
      alert(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <D.Page>
      <Header title="포인트 상점" isBackButton={true} />
      <D.ImageWrapper>
        <D.Thumbnail src={item.partnerResponse.imageUrl} alt={item.partnerResponse.partnerName} />
        <D.PointsBadge>{item.pointCost.toLocaleString()}P</D.PointsBadge>
      </D.ImageWrapper>
      <D.BrandSection>
        <D.BrandRow>
          <D.BrandImage src={item.partnerResponse.imageUrl} alt={item.partnerResponse.partnerName} />
          <D.BrandInfo>
            <D.BrandName>{item.partnerResponse.partnerName}</D.BrandName>
            <D.BrandLocation>{item.partnerResponse.address}</D.BrandLocation>
          </D.BrandInfo>
        </D.BrandRow>
      </D.BrandSection>
      <D.BottomSection>
        <D.NoticeBox>
          <p>{item.content}</p>
        </D.NoticeBox>
        <D.BrandInfoSection>
          <D.SectionTitle>브랜드 정보</D.SectionTitle>
          <D.BrandDescription>{item.partnerResponse.description}</D.BrandDescription>
        </D.BrandInfoSection>
        <D.ButtonWrapper>
          <MainButton
            title={canPurchase ? "구매하기" : "포인트가 부족합니다"}
            disabled={!canPurchase || isPurchasing}
            onClick={handlePurchase}
          />
        </D.ButtonWrapper>
      </D.BottomSection>
    </D.Page>
  );
};

export default PointStoreDetail;
