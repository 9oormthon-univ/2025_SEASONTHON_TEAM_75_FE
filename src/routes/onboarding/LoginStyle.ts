import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;

  button {
    position: absolute;
    bottom: 58px;
    padding: 0;
  }
`;

export const Back = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: absolute;
  left: 38px;
  top: 168px;

  h1 {
    color: ${({ theme }) => theme.colors.text1};
    font-family: NanumSquareRound;
    font-size: 36px;
    font-weight: 800;
    line-height: 125%;
    white-space: pre-wrap;
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text2};
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
    line-height: 150%;
    white-space: pre-wrap;
    margin: 0;
  }
`;
