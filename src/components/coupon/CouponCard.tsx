import styled from "styled-components";
import ArrowIcon from "@assets/history_arrow.svg";

interface CouponCardProps {
  imageUrl: string;
  title: string;
  expiresAt: string;
  onClick?: () => void;
}

const Card = styled.div<{ $expired: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px 18px 16px 10px;
  border-radius: 12px;
  background-color: white;
  box-sizing: border-box;
  cursor: ${({ $expired }) => ($expired ? "default" : "pointer")};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.07);
  opacity: ${({ $expired }) => ($expired ? 0.4 : 1)};
`;

const Thumbnail = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  object-fit: cover;
  flex-shrink: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
`;

const ExpiresAt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
`;

function CouponCard({ imageUrl, title, expiresAt, onClick }: CouponCardProps) {
  const isExpired = new Date(expiresAt) < new Date();

  return (
    <Card $expired={isExpired} onClick={isExpired ? undefined : onClick}>
      <Thumbnail src={imageUrl} alt={title} />
      <Info>
        <Title>{title}</Title>
        <ExpiresAt>{expiresAt} 까지</ExpiresAt>
      </Info>
      {!isExpired && <img src={ArrowIcon} alt="이동" />}
    </Card>
  );
}

export default CouponCard;
