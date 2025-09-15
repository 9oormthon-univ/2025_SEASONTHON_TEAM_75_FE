import styled from "styled-components";
import LocationIcon from "@assets/modal_location.svg";

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

  @media screen and (min-width: 1024px) {
    width: 393px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  border-radius: 20px;
  background: #fff;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);

  padding: 28px 21px 20px 21px;

  img {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: 150%;

  margin: 6px 0 0 0;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.text2};
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  white-space: pre-wrap;

  padding: 0 20px;
  margin: 0 0 20px 0;
`;

const ConfirmButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 100%;
  height: 50px;

  color: white;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.main};

  &:focus {
    outline: none;
  }
`;

function LocationSupportModal({ isOpen, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Background>
      <Container onClick={(e) => e.stopPropagation()}>
        <img src={LocationIcon} alt="지원하지 않는 지역" />
        <Title>지원하지 않는 지역</Title>
        <SubTitle>{`현재는 서울 내 자치구만 지원중이에요.\n다른 지역이 업데이트되면 알려드릴게요!`}</SubTitle>
        <ConfirmButton onClick={onConfirm}>확인하고 계속하기</ConfirmButton>
      </Container>
    </Background>
  );
}

export default LocationSupportModal;
