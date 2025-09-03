import styled from "styled-components";
import Kakao from "@/assets/kakao_login.svg";
import Background from "@assets/start_back.svg";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;

  button {
    position: absolute;
    bottom: 58px;
    padding: 0;
  }
`;

const Back = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: absolute;
  left: 38px;
  top: 168px;

  h1 {
    color: ${({ theme }) => theme.colors.text1};
    font-family: NanumSquareRound;
    font-size: 36px;
    font-weight: 800;
    line-height: 125%;
    white-space: pre-wrap;
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text2};
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
    line-height: 150%;
    white-space: pre-wrap;
    margin: 0;
  }
`;

const Login = () => {
  return (
    <Container>
      <Back src={Background} alt="배경" />
      <button>
        <img src={Kakao} alt="카카오 로그인" />
      </button>
      <Title>
        <h1>{`재활용이\n쉬워지는\n똑똑한 한 컷`}</h1>
        <p>{`쓰레기 버리기 전, 딱 3초면 끝나는\n우리 동네 맞춤형 AI 분리수거 가이드`}</p>
      </Title>
    </Container>
  );
};
export default Login;
