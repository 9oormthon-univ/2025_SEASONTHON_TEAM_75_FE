import MainButton from "@components/MainButton";
import * as P from "./ProfileCompleteStyle";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SuccessAnimation from "@assets/success.json";

const ProfileComplete = () => {
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

      <P.Title>프로필 설정이 완료되었어요</P.Title>
      <P.SubTitle>{`우리 동네에 딱 맞춘 분리수거 가이드,\n지금 시작해볼까요?`}</P.SubTitle>
      <P.ButtonGroup>
        <MainButton
          title="동네 설정하기"
          onClick={() =>
            navigate("/location", { state: { from: "profile_complete" } })
          }
        />
      </P.ButtonGroup>
    </P.Page>
  );
};
export default ProfileComplete;
