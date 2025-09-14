import Kakao from "@/assets/kakao_login.svg";
import Background from "@assets/start_back.svg";
import * as L from "./LoginStyle";
import { useAuthActions } from "@stores/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDistrictActions } from "@stores/userDistrictStore";

const parseLabelToParts = (label?: string) => {
  const [sido, sigungu, eupmyeondong] = (label ?? "")
    .split(" ")
    .filter(Boolean);
  return {
    sido: sido ?? "",
    sigugn: sigungu ?? "",
    eupmyeondong: eupmyeondong ?? "",
  };
};

const Login = () => {
  const { loginWithKakao, loginAsGuest } = useAuthActions();
  const { setCurrentDistrict, setDistrict } = useDistrictActions();
  const navigate = useNavigate();

  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  const handleGuest = async () => {
    try {
      setLoadingMsg("현재 위치 확인 중...");
      await loginAsGuest();

      setLoadingMsg("우리 동네 찾는 중...");
      const cur = await setCurrentDistrict();
      if (!cur) throw new Error("현재 위치로 자치구를 찾지 못했어요.");

      const label = [cur.sido, cur.sigugn, cur.eupmyeondong]
        .filter(Boolean)
        .join(" ");
      const parts = parseLabelToParts(label);

      setLoadingMsg("자치구 등록 중...");
      const registered = await setDistrict({
        districtId: cur.districtId,
        ...parts,
      });
      if (!registered) throw new Error("자치구 서버 등록 실패");

      navigate("/home", { replace: true });
    } catch (e) {
      console.error(e);
      alert("게스트 로그인 실패");
      setLoadingMsg(null);
    }
  };

  return (
    <L.Container>
      <L.Back src={Background} alt="배경" />

      <L.ButtonContainer>
        <button onClick={loginWithKakao}>
          <img src={Kakao} alt="카카오 로그인" />
        </button>
        <button onClick={handleGuest}>건너뛰기</button>
      </L.ButtonContainer>

      <L.Title>
        <h1>{`재활용이\n쉬워지는\n똑똑한 한 컷`}</h1>
        <p>{`쓰레기 버리기 전, 딱 3초면 끝나는\n우리 동네 맞춤형 AI 분리수거 가이드`}</p>
      </L.Title>

      {loadingMsg && (
        <L.GuestLoading>
          <h2>게스트 로그인 중…</h2>
          <p>{loadingMsg}</p>
        </L.GuestLoading>
      )}
    </L.Container>
  );
};
export default Login;
