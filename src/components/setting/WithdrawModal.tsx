import styled from "styled-components";
import WithdrawIcon from "@assets/withdraw.svg";

interface LogoutProps {
  onClose: () => void;
  onConfirm: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;

  @media screen and (min-width: 1025px) {
    width: 393px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  background: var(--white, #fff);
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);
  padding: 28px 19px 20px 19px;

  img {
    width: 60px;
    height: 60px;
  }

  h1 {
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 700;
    margin: 18px 0 10px 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text2};
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 29px 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  button {
    width: 116px;
    height: 44px;
    font-size: 16px;
  }
`;

const Cancel = styled.button`
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 500;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.text5};
`;

const Logout = styled.button`
  color: white;
  font-weight: 600;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.main};
`;

const WithdrawModal = ({ onClose, onConfirm }: LogoutProps) => {
  return (
    <Overlay>
      <Container>
        <img src={WithdrawIcon} alt="회원탈퇴" />
        <h1>정말 탈퇴할까요?</h1>
        <p>최근 기록과 내 동네 정보가 사라져요</p>
        <ButtonGroup>
          <Cancel onClick={onClose}>취소</Cancel>
          <Logout onClick={onConfirm}>회원탈퇴</Logout>
        </ButtonGroup>
      </Container>
    </Overlay>
  );
};

export default WithdrawModal;
