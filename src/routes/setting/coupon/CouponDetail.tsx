import { useNavigate, useLocation } from "react-router-dom";
import * as D from "./CouponDetailStyle";
import CloseIcon from "@assets/header_close.svg";
import QrCardImage from "@assets/coupon_qr_card.svg";
import WarningIcon from "@assets/icon_warning.svg";
import MainButton from "@components/MainButton";
import type { UserCoupon } from "@types";

const CouponDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coupon = location.state?.coupon as UserCoupon | undefined;

  const typeLabel = coupon?.couponType === "ONLINE" ? "[온라인]" : "[오프라인]";

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
          <D.QrBox />
          <D.Badge>{typeLabel}</D.Badge>
          <D.CouponTitle>{coupon?.couponTitle ?? ""}</D.CouponTitle>
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
