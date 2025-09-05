import styled from "styled-components";
import NotFoundIcon from "@assets/notFound.svg";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  margin-top: 30px;
`;

export const HomeBtn = styled.div`
  color: white;
  background-color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 18px;
  border-radius: 12px;
  width: 361px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 360px) {
    width: 340px;
  }
  margin-bottom: 70px;
`;

const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate("/home");
  };
  return (
    <Container>
      <Wrapper>
        <img src={NotFoundIcon} alt="404" />
        <Text>페이지를 찾을 수 없습니다</Text>
      </Wrapper>
      <HomeBtn onClick={handleNavigateToHome}>홈으로 돌아가기</HomeBtn>
    </Container>
  );
};

export default NotFound;
