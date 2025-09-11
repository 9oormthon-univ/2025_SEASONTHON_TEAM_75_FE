import styled from "styled-components";
import RankingUp from "@assets/rankingUp.svg";
import RankingDown from "@assets/rankingDown.svg";
import RankingSame from "@assets/rankingSame.svg";
import type { RankingItemData } from "@types";

export const ItemContainer = styled.div`
  width: 221px;
  display: flex;
  position: relative;
  flex-direction: column;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  flex-shrink: 0;
  background-color: #ffffff;
`;

export const Rank = styled.div`
  position: absolute;
  top: 4%;
  left: 4%;
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 14px;
  width: 35px;
  height: 21px;
  border-radius: 18px;
  text-align: center;
  align-items: center;
`;

export const ItemImage = styled.img`
  width: 100%;
  height: 134px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  align-self: center;
`;

export const InfoWrapper = styled.div`
  padding: 4% 6%;
  display: flex;
  flex-direction: column;
`;

export const Name = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
`;

export const SearchCountBoxUP = styled.div`
  border-radius: 5px;
  background-color: #fdf4f4;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 3px 5px;
  gap: 5px;
  margin: 4px 0;
  color: #eb455b;
`;

export const SearchCountBoxDown = styled.div`
  border-radius: 5px;
  background-color: #f2f8fe;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 3px 5px;
  gap: 5px;
  margin: 4px 0;
  color: #3899e8;
`;

export const SearchCountBoxSame = styled.div`
  border-radius: 5px;
  background-color: #e7fcd1;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 3px 5px;
  gap: 5px;
  margin: 4px 0;
  color: #0ac2a6;
`;

export const CountIcon = styled.img`
  width: 11px;
  height: 7px;
`;

export const SearchCount = styled.div`
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 11px;
`;

const RankingItem = ({
  rank,
  imageUrl,
  name,
  trendDirection,
  searchCount,
}: RankingItemData) => {
  const renderTrendBox = () => {
    switch (trendDirection) {
      case "UP":
        return (
          <SearchCountBoxUP>
            <CountIcon src={RankingUp} alt="랭킹 상승" />
            <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
          </SearchCountBoxUP>
        );
      case "DOWN":
        return (
          <SearchCountBoxDown>
            <CountIcon src={RankingDown} alt="랭킹 하락" />
            <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
          </SearchCountBoxDown>
        );
      case "SAME":
        return (
          <SearchCountBoxSame>
            <CountIcon src={RankingSame} alt="랭킹 유지" />
            <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
          </SearchCountBoxSame>
        );
      default:
        return null;
    }
  };

  return (
    <ItemContainer>
      <Rank>{rank}위</Rank>
      <ItemImage src={imageUrl} alt={name} />
      <InfoWrapper>
        <Name>{name}</Name>
        {renderTrendBox()}
      </InfoWrapper>
    </ItemContainer>
  );
};

export default RankingItem;
