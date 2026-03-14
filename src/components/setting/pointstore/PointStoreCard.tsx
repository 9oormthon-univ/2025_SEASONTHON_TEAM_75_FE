import styled from "styled-components";

interface PointStoreCardProps {
  imageUrl: string;
  isOnline: boolean;
  title: string;
  points: number;
  onClick?: () => void;
}

const Card = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100px;
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 14px;
  flex: 1;
`;

const Badge = styled.span`
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  padding: 2px 0 0 0;
`;

const Points = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.main};
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
`;

function PointStoreCard({
  imageUrl,
  isOnline,
  title,
  points,
  onClick,
}: PointStoreCardProps) {
  return (
    <Card onClick={onClick}>
      <Thumbnail src={imageUrl} alt={title} />
      <Info>
        <Badge>{isOnline ? "[온라인]" : "[오프라인]"}</Badge>
        <Title>{title}</Title>
        <Points>{points.toLocaleString()}P</Points>
      </Info>
    </Card>
  );
}

export default PointStoreCard;
