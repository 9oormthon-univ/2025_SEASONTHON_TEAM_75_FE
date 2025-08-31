import styled from "styled-components";

interface ModalProps {
  title: string;
  confirmText: string;
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
  gap: 32px;

  border-radius: 20px;
  background: #fff;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);

  padding: 38px 25px 22px 25px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
  text-align: center;
  white-space: pre-wrap;
  text-align: left;
  color: ${({ theme }) => theme.colors.text1};

  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12.5px 44px;

  color: #6b6b6b;
  font-size: 16px;
  font-weight: 500;

  border-radius: 10.5px;
  background: #f0f0f0;

  &:focus {
    outline: none;
  }
`;

const ConfirmButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12.5px 44px;

  color: #ffffff;
  font-size: 16px;
  font-weight: 600;

  border-radius: 10.5px;
  background: ${({ theme }) => theme.colors.button};

  &:focus {
    outline: none;
  }
`;

function LocationModal(props: ModalProps) {
  if (!props.isOpen) return null;

  return (
    <Background onClick={props.onCancel}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Title>{props.title}</Title>
        <ButtonGroup>
          <CancelButton onClick={props.onCancel}>취소</CancelButton>
          <ConfirmButton onClick={props.onConfirm}>
            {props.confirmText}
          </ConfirmButton>
        </ButtonGroup>
      </Container>
    </Background>
  );
}

export default LocationModal;
