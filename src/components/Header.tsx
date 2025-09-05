import styled from "styled-components";
import BackIcon from "@/assets/back.svg";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  rightButton?: React.ReactNode;
  isBackButton?: boolean;
  isBorder?: boolean;
}

const Container = styled.div<{ $isBorder?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  background-color: white;
  border-bottom: 1px solid
    ${({ $isBorder }) => ($isBorder ? "#d8d9d8" : "white")};
`;

const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 65px;
  height: 100%;
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
  }
`;

const Title = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  text-align: center;
`;

const RightButton = styled.div`
  width: 65px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

const Spacer = styled.div`
  width: 65px;
`;

function Header({ title, rightButton, isBackButton, isBorder }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <Container $isBorder={isBorder}>
      {isBackButton ? (
        <BackButton onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="홈" />
        </BackButton>
      ) : (
        <Spacer />
      )}

      <Title>{title}</Title>

      {rightButton ? <RightButton>{rightButton}</RightButton> : <Spacer />}
    </Container>
  );
}

export default Header;
