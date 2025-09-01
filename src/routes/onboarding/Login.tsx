import styled from "styled-components";
import Kakao from "@/assets/kakao_login.svg";

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

const Login = () => {
  return (
    <Container>
      <button>
        <img src={Kakao} alt="카카오 로그인" />
      </button>
    </Container>
  );
};
export default Login;
