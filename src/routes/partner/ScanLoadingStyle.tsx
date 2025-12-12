import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
  white-space: pre-line;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 4rem;
  margin-bottom: 100px;
  div {
    color: ${({ theme }) => theme.colors.text2};
    font-weight: 600;
    font-size: 16px;
  }
`;
