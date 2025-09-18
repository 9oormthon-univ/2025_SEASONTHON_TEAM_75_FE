import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 16px;

  height: 100%;
  background-color: white;

  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
  font-family: Pretendard;
`;

export const Image = styled.img`
  width: 134px;

  margin-bottom: 36px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  white-space: pre-wrap;

  margin-bottom: 60px;
`;

export const ButtonGroup = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 55px;
  left: 16px;
  right: 16px;
`;
