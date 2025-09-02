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

export const FailIcon = styled.img`
  width: 112px;
  height: 112px;
`;

export const Text1 = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
  margin: 2rem 0 1rem 0;
`;

export const Text2 = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 360px) {
    width: 340px;
  }
`;

export const ChatBtn = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  width: 361px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  @media (max-width: 360px) {
    width: 340px;
  }
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
