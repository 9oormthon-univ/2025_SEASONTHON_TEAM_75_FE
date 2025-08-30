import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Top = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

export const Bottom = styled.div`
  position: fixed;
  bottom: 0;
  height: 408px;
  padding: 24px 16px;
  box-sizing: border-box; /* 패딩 포함 width 계산 */

  border-radius: 20px 20px 0 0;
  background: #ffffff;

  color: ${({ theme }) => theme.colors.text1};
  font-size: 20px;
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
`;
