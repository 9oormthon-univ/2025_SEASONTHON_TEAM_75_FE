import styled from "styled-components";
import RecyclingIcon from "@assets/recycling.svg";
import TrashCanIcon from "@assets/trash_icon.svg";
import Arrow from "@assets/history_arrow.svg";
import NonSelectIcon from "@assets/history_nosel.svg";
import SelectIcon from "@assets/history_sel.svg";
import { getTrashType, isRecyclableType } from "@utils/trashType";
import type { HistoryItem } from "@types";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
  width: 100%;
`;

export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const TrashImage = styled.img`
  width: 63px;
  height: 63px;
  object-fit: cover;
`;

export const InfoWrapper = styled.div`
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
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Icon = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 5px;
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

interface HistoryCardProps {
  item: HistoryItem;
  mode: "view" | "edit";
  isSelected?: boolean;
  onClick: (id: number) => void;
}

const HistoryCard = ({ item, mode, isSelected, onClick }: HistoryCardProps) => {
  const { id, type, name } = item;
  const trashType = getTrashType(type);
  const isRecyclable = isRecyclableType(type);

  const renderRightIcon = () => {
    if (mode === "edit") {
      return (
        <img src={isSelected ? SelectIcon : NonSelectIcon} alt="선택 아이콘" />
      );
    }
    return <img src={Arrow} alt="상세보기 화살표" />;
  };

  return (
    <Container onClick={() => onClick(id)}>
      <LeftSection>
        <TrashImage src={trashType.icon} alt={trashType.nameKo} />
        <InfoWrapper>
          <Name>{name}</Name>
          <Type>
            <Icon
              src={isRecyclable ? RecyclingIcon : TrashCanIcon}
              alt={isRecyclable ? "재활용 아이콘" : "일반 쓰레기 아이콘"}
            />
            {trashType.nameKo}
          </Type>
        </InfoWrapper>
      </LeftSection>
      <RightSection>{renderRightIcon()}</RightSection>
    </Container>
  );
};

export default HistoryCard;
