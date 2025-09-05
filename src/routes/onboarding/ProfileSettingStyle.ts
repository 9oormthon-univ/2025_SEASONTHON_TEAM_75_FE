import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 16px;

  height: 100%;
  background-color: white;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Profile = styled.div`
  position: relative;
  width: 120px;
  height: 120px;

  margin-top: 20px;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 50%;
  }

  button {
    display: flex;

    position: absolute;
    right: 0;
    bottom: 0;

    padding: 0;
  }
`;

export const Nickname = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  width: 100%;
  max-width: 480px;

  h3 {
    color: ${({ theme }) => theme.colors.text2};
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    padding-left: 5px;
  }

  p {
    color: ${({ theme }) => theme.colors.text2};
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 500;
    margin: 0;
    padding-left: 4px;
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

export const Input = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.box};
  padding: 17px;
  border-radius: 10px;
  gap: 10px;

  p {
    color: ${({ theme }) => theme.colors.text3};
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.165px;
  }
`;

export const Button = styled.button`
  position: absolute;
  bottom: 55px;

  width: 100%;
`;
