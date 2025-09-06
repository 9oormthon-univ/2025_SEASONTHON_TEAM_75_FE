import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  box-sizing: border-box;
  pointer-events: auto;
`;

export const BackBtn = styled.button`
  all: unset;
  cursor: pointer;
  width: 65px;
  height: 100%;
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
  }
`;

export const RightBtn = styled.div`
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
  text-decoration: underline;
`;

export const ScanImg = styled.img`
  width: 100%;
`;

export const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Pretendard";
  padding: 1.3rem;
  box-sizing: border-box;
`;

export const TrashName = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 700;
  font-size: 20px;
`;

export const TrashDes = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 600;
  font-size: 16px;
`;

export const TypeChangeBox = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

export const TypeChangeTitle = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
`;

export const TypeChangeContent = styled.div`
  font-family: "Pretendard";
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text2};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px 5px;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const Type = styled.div<{ isSelected: boolean }>`
  border-radius: 20px;
  width: fit-content;
  flex-shrink: 0;
  padding: 2px 10px;
  box-sizing: border-box;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.sub1 : "#ffffff"};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.main : theme.colors.text2};
  border: 1px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.colors.main : theme.colors.text4};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 500)};
`;

export const MidContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.box};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Pretendard";
  padding: 0 1.3rem 1.3rem 1.3rem;
  box-sizing: border-box;
`;

export const LocationBox = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  span {
    background-color: ${({ theme }) => theme.colors.sub2};
    color: ${({ theme }) => theme.colors.main};
    font-weight: 600;
    font-size: 16px;
    border-radius: 5px;
    padding: 1px 3px;
    margin-left: 3px;
  }
`;

export const MidSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  gap: 10px;
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 700;
  font-size: 18px;
`;

export const GuideBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.div`
  color: ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.sub1};
  font-weight: 600;
  font-size: 14px;
  width: fit-content;
  padding: 1px 11px;
  box-sizing: border-box;
  border-radius: 20px;
`;

export const StepContent = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 500;
  font-size: 16px;
  margin: 10px 0 20px 5px;
`;

export const Notice = styled.div`
  color: #eb455b;
  background-color: #fdf4f4;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  padding: 10px 15px;
  box-sizing: border-box;
`;

export const NoticeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.3rem;
  box-sizing: border-box;
`;

export const ScanBtn = styled.div`
  color: white;
  background-color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
  border-radius: 12px;
  width: 361px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 360px) {
    width: 340px;
  }
`;

export const ChatBtn = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  background-color: ${({ theme }) => theme.colors.text5};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  border-radius: 12px;
  width: 361px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  @media (max-width: 360px) {
    width: 340px;
  }
`;
