import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  background: #ffffff;
`;

export const SearchBox = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 3px;

  height: 40px;
  border-radius: 32.5px;
  border: 0 solid #f7f8f9;
  padding: 0 11px;
  margin: 10px 16px 0 16px;

  background: ${({ theme }) => theme.colors.box};

  input {
    all: unset;
    width: 100%;

    color: ${({ theme }) => theme.colors.text1};
    font-size: 16px;
    font-weight: 500;
  }

  button {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.text3};
  }
`;

export const Now = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  gap: 6px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.text4};

  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;

  margin: 10px 16px 10px 16px;
`;

export const SearchList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 4px;
`;
