import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import * as D from "./CouponDetailStyle";
import CloseIcon from "@assets/header_close.svg";
import QrCardImage from "@assets/coupon_qr_card.svg";
import WarningIcon from "@assets/icon_warning.svg";
import MainButton from "@components/MainButton";
import apiClient from "@utils/apiClient";
import type { UserCouponDetail } from "@types";

const CouponDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userCouponId } = useParams<{ userCouponId: string }>();

  const [detail, setDetail] = useState<UserCouponDetail | null>(
    location.state?.coupon ?? null,
  );
  const [isLoading, setIsLoading] = useState(!location.state?.coupon);

  useEffect(() => {
    if (!userCouponId) return;
    (async () => {
      try {
        const result = await apiClient.get<{ data: UserCouponDetail }>(
          `/api/v1/my/coupons/${userCouponId}`,
        );
        setDetail(result.data?.data ?? null);
      } catch (e) {
        console.error("쿠폰 상세 가져오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userCouponId]);

  const typeLabel =
    detail?.couponType === "ONLINE"
      ? "[온라인]"
      : detail?.couponType === "OFFLINE"
        ? "[오프라인]"
        : "";

  if (isLoading) {
    return (
      <D.Page>
        <D.HeaderRow>
          <D.Title>쿠폰</D.Title>
          <D.CloseBtn onClick={() => navigate(-1)}>
            <img src={CloseIcon} alt="닫기" />
          </D.CloseBtn>
        </D.HeaderRow>
      </D.Page>
    );
  }

  return (
    <D.Page>
      <D.HeaderRow>
        <D.Title>쿠폰</D.Title>
        <D.CloseBtn onClick={() => navigate(-1)}>
          <img src={CloseIcon} alt="닫기" />
        </D.CloseBtn>
      </D.HeaderRow>

      <D.CardWrapper>
        <D.CardImage src={QrCardImage} alt="쿠폰 카드" />
        <D.CardContent>
          <D.QrImage src={detail?.qrImageUrl} alt="QR 코드" />
          <D.Badge>{typeLabel}</D.Badge>
          <D.CouponTitle>{detail?.couponTitle ?? ""}</D.CouponTitle>
          <D.Description>
            공방에 문하고 사장님께 QR을 제시해주세요!
          </D.Description>
        </D.CardContent>
      </D.CardWrapper>

      <D.Divider />

      <D.NoticeSection>
        <D.NoticeTitle>
          <img src={WarningIcon} alt="유의사항" />
          유의사항
        </D.NoticeTitle>
        <D.NoticeText>공방에 방문하고 사장님께 QR을 제시해주세요!</D.NoticeText>
      </D.NoticeSection>

      <D.ButtonWrapper>
        <MainButton title="완료" onClick={() => navigate(-1)} />
      </D.ButtonWrapper>
    </D.Page>
  );
};

export default CouponDetail;
