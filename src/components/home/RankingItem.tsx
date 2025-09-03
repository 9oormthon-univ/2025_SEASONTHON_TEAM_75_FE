import styled from "styled-components";
import RankingUp from "@assets/rankingUp.svg";
import RankingDown from "@assets/rankingDown.svg";
import RecyclingIcon from "@assets/recycling.svg";

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
  height: 59%;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  align-self: center;
`;

export const InfoWrapper = styled.div`
  padding: 5%;
  display: flex;
  flex-direction: column;
`;

export const Name = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
`;

export const Type = styled.div`
  color: ${({ theme }) => theme.colors.text3};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 12px;
    height: 12px;
    margin-right: 5px;
  }
`;

export const SearchCountBoxUP = styled.div`
  border-radius: 5px;
  background-color: #fdf4f4;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 3px 5px;
  gap: 5px;
  margin: 10px 0 0 0;
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
  margin: 5px 0 0 0;
  color: #3899e8;
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

interface RankingItemProps {
  rank: number;
  imageUrl: string;
  name: string;
  type: string;
  isUp: boolean;
  searchCount: number;
}

const RankingItem = ({
  rank,
  imageUrl,
  name,
  type,
  isUp,
  searchCount,
}: RankingItemProps) => {
  return (
    <ItemContainer>
      <Rank>{rank}위</Rank>
      <ItemImage src={imageUrl} alt={name} />
      <InfoWrapper>
        <Name>{name}</Name>
        <Type>
          <img src={RecyclingIcon} alt="재활용 아이콘" />
          {type}
        </Type>
        {isUp ? (
          <SearchCountBoxUP>
            <CountIcon src={RankingUp} alt="랭킹 상승 아이콘" />
            <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
          </SearchCountBoxUP>
        ) : (
          <SearchCountBoxDown>
            <CountIcon src={RankingDown} alt="랭킹 하락 아이콘" />
            <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
          </SearchCountBoxDown>
        )}
      </InfoWrapper>
    </ItemContainer>
  );
};

export default RankingItem;
