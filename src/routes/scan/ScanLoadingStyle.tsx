import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 241px;
  height: 212px;
`;

export const Text1 = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
  white-space: pre-line;
  text-align: center;
  margin: 2rem 0 1rem 0;
`;

export const Text2 = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5rem;
`;
