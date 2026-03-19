import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #3c4f59;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #888;
  font-family: "Pretendard";
`;

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({
  message = "데이터를 불러오고 있어요",
}: LoadingSpinnerProps) => {
  return (
    <LoadingWrapper role="status" aria-live="polite" aria-busy="true">
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingWrapper>
  );
};

export default LoadingSpinner;
