import styled from "styled-components";
import NoMicIcon from "@assets/chat_no_mic.svg";
import MicIcon from "@assets/chat_mic.svg";

type MicProps = {
  active?: boolean;
  onClick?: () => void;
};

const Button = styled.button<{ $active?: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  bottom: 20px;
  left: 16px;

  padding: 0;
`;

const ChatMicButton = ({ active = false, onClick }: MicProps) => {
  const handleClick = () => {
    if (!active) return;
    onClick?.();
  };

  return (
    <Button onClick={handleClick} $active={active}>
      <img src={active ? MicIcon : NoMicIcon} alt="마이크" />
    </Button>
  );
};

export default ChatMicButton;
