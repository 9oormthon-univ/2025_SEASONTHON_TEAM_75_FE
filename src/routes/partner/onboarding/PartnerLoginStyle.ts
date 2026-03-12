import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

export const BackBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px;
`;

export const Logo = styled.img`
  width: 126px;
  margin-top: 30px;
  align-self: center;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
  margin-top: 40px;
`;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.box};
  padding: 17px;
  border-radius: 10px;
  border: 1px solid transparent;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.main};
  }

  input {
    all: unset;
    width: 100%;
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.165px;

    &::placeholder {
      color: ${({ theme }) => theme.colors.text3};
    }
  }
`;

export const KeepLogin = styled.label`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  padding: 0 16px;
  margin-top: 10px;

  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  img {
    width: 12px;
    height: 12px;
  }
`;

export const ButtonWrapper = styled.div`
  padding: 0 16px;
  margin-top: 40px;
`;
