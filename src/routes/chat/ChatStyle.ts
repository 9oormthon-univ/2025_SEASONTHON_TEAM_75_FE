import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.box};
`;

export const BottomTouchBlocker = styled.div<{ $disabled?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 78px;
  z-index: 200;

  pointer-events: ${({ $disabled }) => ($disabled ? "auto" : "none")};
`;
