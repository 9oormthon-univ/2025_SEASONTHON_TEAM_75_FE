import styled from "styled-components";
import LocationImg from "@assets/modal_location.svg";
import { useNavigate } from "react-router-dom";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media screen and (min-width: 1024px) {
    width: 393px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 30px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);
  width: fit-content;
  gap: 25px;
`;

export const LocationIcon = styled.img`
  width: 87px;
  height: 87px;
`;

export const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
`;

export const LoginBtn = styled.button`
  cursor: pointer;
  all: unset;
  background-color: ${({ theme }) => theme.colors.text1};
  color: white;
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  border-radius: 12px;
  width: 268px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LoginGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginGuideModal = ({ isOpen, onClose }: LoginGuideModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <LocationIcon src={LocationImg} alt="위치 아이콘"></LocationIcon>
        <Title>
          로그인하면
          <br />내 동네를 변경할 수 있어요
        </Title>
        <LoginBtn onClick={handleLogin}>카카오로 로그인 하기</LoginBtn>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoginGuideModal;
