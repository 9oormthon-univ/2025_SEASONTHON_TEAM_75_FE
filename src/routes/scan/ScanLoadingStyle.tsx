import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Text1 = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
  white-space: pre-line;
  text-align: center;
  margin-bottom: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
`;
