import styled from "styled-components";
import BackIcon from "@/assets/back.svg";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightButton?: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #d8d9d8;
`;

const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 65px;
  height: 100%;
  display: flex;
  align-items: center;
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

function Header(props: HeaderProps) {
  return (
    <Container>
      <BackButton onClick={props.onBack}>
        <img src={BackIcon} alt="홈" />
      </BackButton>

      <Title>{props.title}</Title>

      {props.rightButton ? (
        <RightButton>{props.rightButton}</RightButton>
      ) : (
        <Spacer />
      )}
    </Container>
  );
}

export default Header;
