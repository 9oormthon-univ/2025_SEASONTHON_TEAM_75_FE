import styled from "styled-components";
import DeleteIcon from "@assets/trashCan.svg";

interface ModalProps {
  district: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  border-radius: 20px;
  background: #fff;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);

  padding: 28px 19px 20px 19px;

  img {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
  white-space: pre-wrap;
  text-align: center;
  color: ${({ theme }) => theme.colors.text1};

  margin: 0 0 9px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12.5px 44px;

  color: ${({ theme }) => theme.colors.text2};
  font-size: 16px;
  font-weight: 500;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.text5};

  &:focus {
    outline: none;
  }
`;

const ConfirmButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12.5px 44px;

  color: white;
  font-size: 16px;
  font-weight: 600;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.main};

  &:focus {
    outline: none;
  }
`;

function LocationDeleteModal({
  district,
  isOpen,
  onCancel,
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <Background onClick={onCancel}>
      <Container onClick={(e) => e.stopPropagation()}>
        <img src={DeleteIcon} alt="삭제" />
        <Title>{`'${district}'을\n삭제할까요?`}</Title>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
        </ButtonGroup>
      </Container>
    </Background>
  );
}

export default LocationDeleteModal;
