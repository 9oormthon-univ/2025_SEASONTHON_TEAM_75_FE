import styled from "styled-components";
import type { UserCoupon } from "@types";
import DefaultProfile from "@assets/pt_usage_profile.svg";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 10px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  width: 100%;
`;

export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-right: 5px;
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
`;

export const User = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
  span {
    color: ${({ theme }) => theme.colors.text2};
  }
`;

const CouponCard = ({ item }: { item: UserCoupon }) => {
  const { profile, title, userName, userId } = item;

  return (
    <Container>
      <LeftSection>
        <ProfileImage src={profile || DefaultProfile} alt="프로필 사진" />
      </LeftSection>
      <RightSection>
        <User>
          {userName}님 <span>#{userId}</span>
        </User>
        <Title>{title}</Title>
      </RightSection>
    </Container>
  );
};

export default CouponCard;
