import styled from "styled-components";
import MicIcon from "@assets/chat_no_mic.svg";

const Button = styled.button`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  bottom: 20px;
  left: 16px;

  padding: 0;
`;

const ChatMicButton = () => {
  return (
    <Button>
      <img src={MicIcon} alt="마이크" />
    </Button>
  );
};

export default ChatMicButton;
