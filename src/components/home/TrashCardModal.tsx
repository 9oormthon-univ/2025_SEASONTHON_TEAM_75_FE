import styled from "styled-components";

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
  padding: 40px 25px 25px 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);
  width: 85%;
`;

export const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.text4};
  margin: 15px 0;
`;

export const Description = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 40px;
  white-space: pre-wrap;
  text-align: center;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.main};
  color: #ffffff;
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

interface TrashCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const TrashCardModal = ({
  isOpen,
  onClose,
  title,
  content,
}: TrashCardModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Divider />
        <Description>{content}</Description>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TrashCardModal;
