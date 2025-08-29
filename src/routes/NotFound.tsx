import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
`;

const NotFound = () => {
  return (
    <Container>
      <div>404 - 페이지를 찾을 수 없습니다.</div>
      <Link to="/">홈으로 돌아가기</Link>
    </Container>
  );
};

export default NotFound;
