import styled from "styled-components";

export const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.box};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Profile = styled.div`
  display: flex;
  gap: 20px;
  padding: 22px 16px;
  margin: 16px;
  align-items: center;

  border-radius: 12px;
  background: var(--white, #fff);

  img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Pretendard;

  h3 {
    color: ${({ theme }) => theme.colors.text1};
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text2};
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 12px;
  background: white;
  margin: 10px 16px 0 16px;
  padding: 8px 0;
`;

export const Feedback = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;

  border-radius: 12px;
  background: var(--white, #fff);

  margin: 20px 16px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 24px;
    height: 24px;
  }

  p {
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.16px;
    margin: 0;
  }
`;

export const Auth = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 12px;
  background: white;
  margin: 0 16px;
  padding: 8px 0;
`;

export const AuthItem = styled.button`
  width: 100%;
  text-align: start;
  padding: 16px;

  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.16px;
`;
