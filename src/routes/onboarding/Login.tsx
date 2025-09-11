import Kakao from "@/assets/kakao_login.svg";
import Background from "@assets/start_back.svg";
import * as L from "./LoginStyle";
import { useAuthActions } from "@stores/authStore";

const Login = () => {
  const { loginWithKakao, loginAsGuest } = useAuthActions();

  return (
    <L.Container>
      <L.Back src={Background} alt="배경" />

      <L.ButtonContainer>
        <button onClick={loginWithKakao}>
          <img src={Kakao} alt="카카오 로그인" />
        </button>
        <button onClick={loginAsGuest}>건너뛰기</button>
      </L.ButtonContainer>

      <L.Title>
        <h1>{`재활용이\n쉬워지는\n똑똑한 한 컷`}</h1>
        <p>{`쓰레기 버리기 전, 딱 3초면 끝나는\n우리 동네 맞춤형 AI 분리수거 가이드`}</p>
      </L.Title>
    </L.Container>
  );
};
export default Login;
