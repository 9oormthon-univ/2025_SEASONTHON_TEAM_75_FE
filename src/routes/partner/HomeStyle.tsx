import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const HomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 1rem 1.5rem 0rem 1.5rem;
  box-sizing: border-box;
`;

export const Logo = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 5px;
  margin-top: 5px;
`;

export const QRBox = styled.div`
  font-family: "Pretendard";
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  margin: 1.5rem auto 1rem auto;
  box-sizing: border-box;
  border-radius: 30px;
  background: linear-gradient(to right, #0ac2a6, #15debf);
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-radius: 25px;
`;

export const QRIcon = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  img {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const Titles = styled.div`
  color: #ffffff;
`;

export const TitleTop = styled.div`
  font-weight: 700;
  font-size: 26px;
`;

export const TitleBottom = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

export const BgBox = styled.div`
  background-color: #f8f8f8;
  width: 100%;
  margin: 1rem 0;
  flex: 1;
`;

export const TodayUsageList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 12px;
`;

export const Inquiry = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  margin: 1.5rem 1.5rem 0 1.5rem;
  height: 62px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: #ffffff;
  div {
    font-family: "Pretendard";
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text1};
  }
  img {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
