import styled from "styled-components";

interface ChatWidgetSProps {
  title: string;
  selected: boolean;
  onClick: () => void;
}

const Container = styled.div<{ $selected: boolean }>`
  padding: 10px 16px;

  border-radius: 22px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.main : theme.colors.text4};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.sub1 : "white"};

  img {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.div<{ $selected: boolean }>`
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.main : theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? "600" : "500")};
`;

const ChatWidgetS = ({ title, selected, onClick }: ChatWidgetSProps) => {
  return (
    <Container $selected={selected} onClick={onClick}>
      <Title $selected={selected}>{title}</Title>
    </Container>
  );
};

export default ChatWidgetS;
