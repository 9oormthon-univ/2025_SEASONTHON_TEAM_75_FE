import styled from "styled-components";

interface ButtonProps {
  title: string;
  onClick?: () => void;
}

const Button = styled.button`
  all: unset;

  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.165px;

  background-color: ${({ theme }) => theme.colors.button};
  border-radius: 12px;
  height: 59px;
  width: 100%;
  max-width: 450px;
`;

function MainButton(props: ButtonProps) {
  return <Button onClick={props.onClick}>{props.title}</Button>;
}

export default MainButton;
