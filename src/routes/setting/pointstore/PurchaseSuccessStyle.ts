import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

export const BackBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px;
  align-self: flex-start;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 12px;
  padding: 0 16px;
  text-align: center;
  margin-bottom: 120px;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 28px;
  font-weight: 700;
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
`;

export const SuccessIcon = styled.img`
  width: 120px;
  margin: 80px 0;
`;

export const ButtonGroup = styled.div`
  position: absolute;
  bottom: 78px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const GradientButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 59px;
  border-radius: 12px;
  background: linear-gradient(90deg, #9136a5, #ef1f2d, #fca943);
  color: white;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.165px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const SubButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;
