import MainButton from "@components/MainButton";
import * as P from "./PartnerLoginCompleteStyle";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SuccessAnimation from "@assets/success.json";

const PartnerLoginComplete = () => {
  const navigate = useNavigate();

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: SuccessAnimation,
    style: { width: "200px" },
  };

  return (
    <P.Page>
      <Lottie {...lottieOptions} />

      <P.Title>파트너 등록이 완료되었어요</P.Title>
      <P.SubTitle>{`이제 브랜드 할인 쿠폰을 만들어\n특공 코인으로 판매해 볼까요?`}</P.SubTitle>
      <P.ButtonGroup>
        <MainButton
          title="대시보드로 이동하기"
          onClick={() => navigate("/partner/home")}
        />
      </P.ButtonGroup>
    </P.Page>
  );
};

export default PartnerLoginComplete;
