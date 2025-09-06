import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

export const Top = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

export const Bottom = styled.div<{ $setup?: boolean }>`
  position: fixed;
  bottom: 0;
  height: ${({ $setup }) => ($setup ? "254px" : "408px")};
  padding: 24px 16px;
  box-sizing: border-box; /* 패딩 포함 width 계산 */

  border-radius: 20px 20px 0 0;
  background: #ffffff;

  color: ${({ theme }) => theme.colors.text1};
  font-size: ${({ $setup }) => ($setup ? "18px" : "20px")};
  font-weight: 700;

  z-index: 1;

  /* PC 환경에서 중앙 고정 */
  width: 100vw;
  @media (hover: hover) and (pointer: fine) {
    width: 393px;
  }

  p {
    margin: 0;
  }
`;

export const Warn = styled.div`
  display: flex;

  padding: 14px;
  justify-content: flex-start;
  gap: 7px;

  border-radius: 12px;
  background: var(--red2, #fdf4f4);

  color: #eb455b;
  font-size: 14px;
  font-weight: 500;

  margin: 20px 0 21px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 22px;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 64px;

  color: ${({ theme }) => theme.colors.text2};
  font-size: 16px;
  font-weight: 500;

  border-radius: 15px;
  background: #f0f2f3;

  &:focus {
    outline: none;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: absolute;
  top: 54px;
  right: 16px;

  width: 126px;
  padding: 24px 18px;
  z-index: 5;

  color: white;
  font-family: Pretendard;

  background: rgba(47, 47, 46, 0.8);
  border-radius: 10px;

  h1 {
    font-size: 14px;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: -0.165px;
    margin: 0;
  }

  p {
    font-size: 12px;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: -0.165px;
    margin: 0;
  }
`;

export const Toast = styled.div`
  position: relative;
  bottom: 115px;

  padding: 16px;
  margin: 0 16px;
  border-radius: 12px;
  background: rgba(47, 47, 46, 0.75);
  z-index: 100;

  color: white;
  text-align: left;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.165px;
`;

export const Complete = styled.div`
  position: absolute;
  bottom: 55px;
  left: 16px;
  right: 16px;
  z-index: 50;
`;
