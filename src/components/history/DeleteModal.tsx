import styled from "styled-components";
import TrashCan from "@assets/trashCan.svg";

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

  @media screen and (min-width: 1025px) {
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
  width: 75%;
  gap: 25px;
`;

export const TrashCanIcon = styled.img`
  width: 60px;
  height: 60px;
`;

export const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
  margin-bottom: 5px;
`;

export const Text = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text2};
  text-align: center;
`;

export const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;

export const SelectButton = styled.button`
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.main};
  color: #ffffff;
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.button`
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.text5};
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ onClose, onConfirm }: DeleteModalProps) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <TrashCanIcon src={TrashCan} alt="쓰레기통 아이콘"></TrashCanIcon>
        <div>
          <Title>기록을 삭제할까요?</Title>
          <Text>삭제된 기록은 되돌릴 수 없어요</Text>
        </div>
        <BtnWrapper>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <SelectButton onClick={onConfirm}>삭제</SelectButton>
        </BtnWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteModal;
