import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.text5};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 56px;
  padding: 0 20px;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  margin: 0;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text1};
`;

export const CloseBtn = styled.button`
  all: unset;
  position: absolute;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
  }
`;

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

export const CardImage = styled.img`
  display: block;
`;

export const CardContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 93px 0 0 0;
`;

export const QrBox = styled.div`
  width: 181px;
  height: 181px;
  background-color: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
`;

export const Badge = styled.span`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text2};
  padding-top: 81px;
`;

export const CouponTitle = styled.p`
  margin: 0;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
  padding: 5px 0;
`;

export const Description = styled.p`
  margin: 0;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text2};
  text-align: center;
`;

export const Divider = styled.div`
  margin-top: 25px;
  width: 100%;
  height: 4px;
  background-color: #e6e9eb;
  flex-shrink: 0;
`;

export const NoticeSection = styled.div`
  margin-top: 21px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NoticeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text1};

  img {
    width: 20px;
    height: 20px;
  }
`;

export const NoticeText = styled.p`
  margin: 0;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text2};
`;

export const ButtonWrapper = styled.div`
  margin-top: auto;
  padding: 16px 20px 55px;
`;
