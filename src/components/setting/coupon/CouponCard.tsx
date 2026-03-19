import styled from "styled-components";
import ArrowIcon from "@assets/history_arrow.svg";

interface CouponCardProps {
  imageUrl: string;
  title: string;
  purchasedAt: string;
  couponType: "ONLINE" | "OFFLINE";
  isUsed: boolean;
  onClick?: () => void;
}

const Card = styled.div<{ $used: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px 18px 16px 10px;
  border-radius: 12px;
  background-color: white;
  box-sizing: border-box;
  cursor: ${({ $used }) => ($used ? "default" : "pointer")};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.07);
  opacity: ${({ $used }) => ($used ? 0.4 : 1)};
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

const PurchasedAt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
`;

function CouponCard({ imageUrl, title, purchasedAt, couponType, isUsed, onClick }: CouponCardProps) {
  const formatted = purchasedAt.slice(0, 10).replace(/-/g, ".");
  const typeLabel = couponType === "ONLINE" ? "[온라인]" : "[오프라인]";

  return (
    <Card $used={isUsed} onClick={isUsed ? undefined : onClick}>
      <Thumbnail src={imageUrl} alt={title} />
      <Info>
        <Title>{typeLabel} {title}</Title>
        <PurchasedAt>{formatted} 구매</PurchasedAt>
      </Info>
      {!isUsed && <img src={ArrowIcon} alt="이동" />}
    </Card>
  );
}

export default CouponCard;
