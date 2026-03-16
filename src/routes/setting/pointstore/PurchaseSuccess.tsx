import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./PurchaseSuccessStyle";
import BackIcon from "@assets/back.svg";
import BgCoupon from "@assets/bg_coupon.png";
import SuccessClapIcon from "@assets/icon_success_clap.svg";
import type { PurchaseResult } from "@types";

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchase = location.state?.purchase as PurchaseResult | undefined;

  const handleSaveToGallery = async () => {
    const url = purchase?.qrImageUrl;
    if (!url) {
      alert("저장할 이미지가 없습니다.");
      return;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${purchase?.couponTitle ?? "coupon"}_qr.png`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert("이미지 저장에 실패했습니다.");
    }
  };

  return (
    <S.Page>
      <S.BackBtn onClick={() => navigate(-1)}>
        <img src={BackIcon} alt="뒤로가기" />
      </S.BackBtn>

      <S.BgImage src={BgCoupon} alt="배경" />

      <S.Content>
        <S.Title>할인쿠폰을 구매했어요!</S.Title>
        <S.Description>
          [{purchase?.couponTitle ?? ""}] 브랜드에서 사용할 수 있어요!
        </S.Description>
        <S.SuccessIcon src={SuccessClapIcon} alt="구매 완료" />
      </S.Content>

      <S.ButtonGroup>
        <S.GradientButton onClick={() => navigate("/coupon")}>
          쿠폰 사용하러 가기
        </S.GradientButton>
        <S.SubButton onClick={handleSaveToGallery}>갤러리에 저장하기</S.SubButton>
      </S.ButtonGroup>
    </S.Page>
  );
};

export default PurchaseSuccess;
