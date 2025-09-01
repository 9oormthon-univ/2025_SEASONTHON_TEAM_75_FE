import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  justify-content: space-between;
  width: calc(100% - 2rem);
  margin: 0 auto;
  box-sizing: border-box;
  height: 345px;
  border-radius: 30px;
  background-image: url("/home_card.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 1.3rem;
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

export const Titles = styled.div``;

export const TitleTop = styled.div`
  font-weight: 500;
  font-size: 26px;
`;

export const TitleBottom = styled.div`
  font-weight: 500;
  font-size: 26px;
`;

export const Highlight1 = styled.span`
  font-weight: 700;
  margin: 0;
`;

export const Highlight2 = styled.span`
  color: #5bd6c9;
  font-weight: 700;
  margin: 0;
`;

export const SubTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin: 0.8rem 0;
`;

export const BgBox = styled.div`
  background-color: #f8f8f8;
  border-radius: 25px 25px 0 0;
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
  margin-bottom: 50px;
`;
