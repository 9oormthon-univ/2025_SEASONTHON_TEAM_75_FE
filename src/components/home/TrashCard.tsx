import MoreIcon from "@assets/more.svg";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
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

export const Type = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const DateText = styled.span`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
`;

export const Icon = styled.img`
  width: 10px;
  height: 16px;
  margin-right: 2px;
`;

interface TrashCardProps {
  imageUrl: string;
  type: string;
  description: string;
  date: Date;
  onClick: () => void;
}

const TrashCard = ({
  imageUrl,
  type,
  description,
  date,
  onClick,
}: TrashCardProps) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedDate = `${year}년 ${month}월`;

  return (
    <Container onClick={onClick}>
      <LeftSection>
        <TrashImage src={imageUrl} alt={type} />
        <InfoWrapper>
          <Type>{type}</Type>
          <Description>{description}</Description>
        </InfoWrapper>
      </LeftSection>

      <RightSection>
        <DateText>{formattedDate}</DateText>
        <Icon src={MoreIcon} alt="더보기" />
      </RightSection>
    </Container>
  );
};

export default TrashCard;
