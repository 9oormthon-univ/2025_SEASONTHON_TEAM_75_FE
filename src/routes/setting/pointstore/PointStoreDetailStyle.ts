import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  flex-shrink: 0;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PointsBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.sub1};
  border: 1px solid ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.main};
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  background-color: white;
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.box};
  flex: 1;
  padding: 20px 16px;
  gap: 20px;
`;

export const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  height: 68px;
  border-radius: 12px;
  background-color: white;
  border: 0.5px solid ${({ theme }) => theme.colors.main};

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const BrandInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
`;

export const SectionTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
`;

export const BrandDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 393px;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  padding-left: 4px;
  gap: 14px;
`;

export const BrandImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const BrandInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const BrandName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
`;

export const BrandLocation = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
