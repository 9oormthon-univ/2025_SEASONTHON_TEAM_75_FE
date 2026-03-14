import { useNavigate } from "react-router-dom";
import * as S from "./PurchaseSuccessStyle";
import BackIcon from "@assets/back.svg";
import SuccessClapIcon from "@assets/icon_success_clap.svg";

// TODO: useLocation 또는 props로 브랜드명 받기
const MOCK_BRAND_NAME = "그린 공방";

const PurchaseSuccess = () => {
  const navigate = useNavigate();

  return (
    <S.Page>
      <S.BackBtn onClick={() => navigate(-1)}>
        <img src={BackIcon} alt="뒤로가기" />
      </S.BackBtn>

      <S.Content>
        <S.Title>할인쿠폰을 구매했어요!</S.Title>
        <S.Description>
          [{MOCK_BRAND_NAME}] 브랜드에서 사용할 수 있어요!
        </S.Description>
        <S.SuccessIcon src={SuccessClapIcon} alt="구매 완료" />
      </S.Content>

      <S.ButtonGroup>
        <S.GradientButton onClick={() => navigate("/coupon")}>
          쿠폰 사용하러 가기
        </S.GradientButton>
        <S.SubButton onClick={() => {}}>갤러리에 저장하기</S.SubButton>
      </S.ButtonGroup>
    </S.Page>
  );
};

export default PurchaseSuccess;
