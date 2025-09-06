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

export const EditBtn = styled.button`
  all: unset;
  color: ${({ theme }) => theme.colors.main};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
  padding: 2px 0;
  box-sizing: border-box;

  &:disabled {
    display: none;
  }
`;

export const NoHistoryBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
  gap: 40px;
  margin-top: 25%;
  img {
    width: 131px;
    height: 148px;
  }
`;

export const CardWrapper = styled.div`
  overflow-x: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 0 1.5rem 110px 1.5rem;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
