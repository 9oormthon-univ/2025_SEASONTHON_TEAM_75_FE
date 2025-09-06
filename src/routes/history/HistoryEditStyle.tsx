import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.box};
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
`;

export const HistoryCount = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
`;

interface SelectAllBtnProps {
  isActive: boolean;
}
export const SelectAllBtn = styled.button<SelectAllBtnProps>`
  all: unset;
  display: flex;
  align-items: center;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 12px;
  border-radius: 41px;
  padding: 5px 11px;
  cursor: pointer;

  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.text1 : theme.colors.text5};
  color: ${({ theme, isActive }) => (isActive ? "white" : theme.colors.text3)};

  img {
    margin-right: 3px;
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 0 1.5rem;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const Bottom = styled.div`
  width: 100%;
  height: 145px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1.5rem;
  box-sizing: border-box;
  background-color: white;
`;

export const DeleteBtn = styled.button`
  all: unset;
  color: white;
  background-color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 20px;
  border-radius: 12px;
  width: 361px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 360px) {
    width: 340px;
  }
  &:disabled {
    background-color: #b6ede5;
  }
`;
