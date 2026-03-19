import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.box};
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const BannerImage = styled.img`
  width: 100%;
  display: block;
  flex-shrink: 0;
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
`;

export const CouponCount = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
`;

export const SortDropdown = styled.div`
  position: relative;
`;

export const SortTrigger = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.text4};
  background-color: white;
  font-family: "Pretendard";
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.main};
    outline-offset: 2px;
  }

  img {
    width: 8px;
  }
`;

export const SortMenu = styled.ul`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background-color: white;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.text4};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 90px;
  z-index: 10;
  overflow: hidden;
`;

export const SortOption = styled.li<{ $active: boolean }>`
  padding: 10px 14px;
  font-family: "Pretendard";
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.main : theme.colors.text1};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.box};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.main};
    outline-offset: -2px;
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 0 1.5rem 110px 1.5rem;
  box-sizing: border-box;
`;

export const NoItemBox = styled.div`
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
