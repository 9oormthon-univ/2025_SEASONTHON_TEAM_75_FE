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
  width: 62px;
  height: 32px;
`;

export const LocationBox = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-direction: row;
`;

export const LocationIcon = styled.img`
  width: 11px;
  height: 14px;
`;

export const LocationName = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
`;

export const LocationDropdown = styled.img`
  width: 10px;
  height: 6px;
`;

export const MainSection = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  margin: 0 auto;
  box-sizing: border-box;
  height: 350px;
  border-radius: 30px;
  background-image: url("/home_bg.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 1.3rem;
  margin-top: 1.3rem;
`;

export const Today = styled.div`
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  background-color: #5bd6c9;
  width: 72px;
  border-radius: 47px;
  text-align: center;
  align-items: center;
`;

export const Titles = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 500;
  font-size: 26px;
  margin: 10px 0;
`;

export const TitleTop = styled.div``;

export const TitleBottom = styled.div``;

export const Highlight1 = styled.span`
  font-weight: 700;
`;

export const Highlight2 = styled.span`
  color: ${({ theme }) => theme.colors.main};
  font-weight: 700;
`;

export const SubTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #6f7274;
  margin-top: 10px;
`;

export const MainIcon = styled.div`
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

export const BgBox = styled.div`
  background-color: #f8f8f8;
  width: 100%;
  margin-top: 1rem;
  flex: 1;
`;

export const RankingWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 0 0 0 1.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TrashCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 1.5rem;
  margin-bottom: 100px;
`;
