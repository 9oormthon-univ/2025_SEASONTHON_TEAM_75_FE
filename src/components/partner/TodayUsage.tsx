import styled from "styled-components";
import Arrow from "@assets/pt_td_arrow.svg";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background-color: #3c4f59;
  border-radius: 12px;
  cursor: pointer;
  color: #ffffff;
  height: 110px;
  flex: 1;
  box-sizing: border-box;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: auto;
  }
`;

export const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 22px;
`;

interface TodayUsageProps {
  title: string;
  usage: string;
  onClick?: () => void;
}

const TodayUsage = ({ title, usage, onClick }: TodayUsageProps) => {
  return (
    <Container onClick={onClick}>
      <TopSection>
        <Title>{title}</Title>
        <img src={Arrow} alt="화살표" />
      </TopSection>
      <BottomSection>{usage}</BottomSection>
    </Container>
  );
};

export default TodayUsage;
