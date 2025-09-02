import styled from "styled-components";

interface ChatBoxProps {
  message: string;
  bot: boolean;
}

const Container = styled.div<{ $isBot?: boolean }>`
  display: inline-flex;
  padding: 12px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  white-space: pre-wrap;

  border-radius: ${({ $isBot }) =>
    $isBot ? "3px 15px 15px 15px" : "15px 3px 15px 15px"};
  background: ${({ theme, $isBot }) => ($isBot ? "white" : theme.colors.main)};
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.07);

  color: ${({ theme, $isBot }) => ($isBot ? theme.colors.text1 : "white")};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: ${({ $isBot }) => ($isBot ? "500" : "600")};
  line-height: 140%;
`;

const ChatBox = ({ message, bot }: ChatBoxProps) => {
  return <Container $isBot={bot}>{message}</Container>;
};

export default ChatBox;
