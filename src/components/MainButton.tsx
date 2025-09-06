import styled from "styled-components";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = styled.button<{ disabled?: boolean }>`
  all: unset;

  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.165px;

  background-color: ${({ theme, disabled }) =>
    disabled ? "#B6EDE5" : theme.colors.main};
  border-radius: 12px;
  height: 59px;
  width: 100%;
  max-width: 450px;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
`;

function MainButton({ title, onClick, disabled }: ButtonProps) {
  return (
    <Button onClick={disabled ? undefined : onClick} disabled={disabled}>
      {title}
    </Button>
  );
}

export default MainButton;
