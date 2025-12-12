import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  margin: 0 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text1};
  box-sizing: border-box;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
`;

export const Section = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      font-weight: 600;
      font-size: 24px;
      margin-right: 3px;
    }
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 0.7px;
  background-color: #f3f3f3f3;
`;

const CouponStats = () => {
  return (
    <Container>
      <Section>
        <div>이번 주</div>
        <div>
          <div>5</div>개
        </div>
      </Section>
      <Divider />
      <Section>
        <div>이번 달</div>
        <div>
          <div>50</div>개
        </div>
      </Section>
      <Divider />
      <Section>
        <div>전체 사용량</div>
        <div>
          <div>150</div>개
        </div>
      </Section>
    </Container>
  );
};

export default CouponStats;
