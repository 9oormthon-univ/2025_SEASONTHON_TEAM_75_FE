import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Icon = styled.img`
  width: 134px;
  height: 134px;
  margin-bottom: 36px;
`;

export const Text1 = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 12px;
`;

export const Text2 = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  margin-bottom: 60px;
`;

export const ScanBtn = styled.div`
  color: white;
  background-color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 18px;
  border-radius: 12px;
  width: 361px;
  height: 60px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 55px;
  @media (max-width: 360px) {
    width: 340px;
  }
`;
