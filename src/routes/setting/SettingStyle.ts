import styled from "styled-components";

export const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.box};
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
`;

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 110px;
  scrollbar-width: none;
`;

export const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin: 16px;
  align-items: center;
  height: 103px;

  border-radius: 12px;
  background: var(--white, #fff);
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
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
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 16px 20px 16px;

  h1 {
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.18px;
    margin: 0;
    padding-left: 4px;
  }
`;

export const TagItemGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
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
