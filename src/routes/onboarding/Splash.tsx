import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Logo from "@assets/splash_logo.svg";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to   { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.main};
  animation: ${fadeIn} 400ms ease-out;
`;

const Title = styled.div`
  position: absolute;
  bottom: 83px;
  color: white;
  text-align: center;
  font-family: NanumSquareRound;
  font-size: 20px;
  font-weight: 800;
`;

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <img src={Logo} alt="로고" />
      <Title>분리특공대</Title>
    </Container>
  );
};

export default Splash;
