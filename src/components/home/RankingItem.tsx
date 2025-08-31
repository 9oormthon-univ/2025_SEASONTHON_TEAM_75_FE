import styled from "styled-components";
import RankingIcon from "@assets/rankingIcon.svg";

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
  top: 3.2%;
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 14px;
  width: 40px;
  height: 20px;
  border-radius: 12px;
  text-align: center;
  align-items: center;
`;

export const ItemImage = styled.img`
  width: 93.6%;
  height: 56.8%;
  object-fit: cover;
  border-radius: 12px;
  align-self: center;
  margin-top: 3.2%;
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

export const SearchCount = styled.div`
  color: ${({ theme }) => theme.colors.text3};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 13px;
`;

export const ChangeBox = styled.div`
  border-radius: 5px;
  background-color: #fdf4f4;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 3px 5px;
  gap: 5px;
  margin: 5px 0 0 0;
`;

export const ChangeIcon = styled.img`
  width: 11px;
  height: 7px;
`;

export const ChangePercent = styled.div`
  color: #eb455b;
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 11px;
`;

interface RankingItemProps {
  rank: number;
  imageUrl: string;
  name: string;
  searchCount: number;
  changePercentage: number;
}

const RankingItem = ({
  rank,
  imageUrl,
  name,
  searchCount,
  changePercentage,
}: RankingItemProps) => {
  return (
    <ItemContainer>
      <Rank>{rank}위</Rank>
      <ItemImage src={imageUrl} alt={name} />
      <InfoWrapper>
        <Name>{name}</Name>
        <SearchCount>검색량 {searchCount.toLocaleString()}회</SearchCount>
        <ChangeBox>
          <ChangeIcon src={RankingIcon} alt="랭킹 아이콘"></ChangeIcon>
          <ChangePercent>전주 대비 +{changePercentage}%</ChangePercent>
        </ChangeBox>
      </InfoWrapper>
    </ItemContainer>
  );
};

export default RankingItem;
