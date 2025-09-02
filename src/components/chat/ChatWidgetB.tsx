import styled from "styled-components";

import SearchIconGray from "@assets/chat_search_gray.svg";
import ListIconGray from "@assets/chat_list_gray.svg";
import SearchIcon from "@assets/chat_search.svg";
import ListIcon from "@assets/chat_list.svg";

interface ChatWidgetBProps {
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}

const Container = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 15px 12px;
  flex-direction: column;
  gap: 4px;

  border-radius: 15px;
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

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 500;
`;

const ChatWidgetB = ({ title, sub, selected, onClick }: ChatWidgetBProps) => {
  return (
    <Container $selected={selected} onClick={onClick}>
      {title === "단어 검색" && (
        <img src={selected ? SearchIcon : SearchIconGray} alt="단어 검색" />
      )}
      {title === "카테고리 검색" && (
        <img src={selected ? ListIcon : ListIconGray} alt="단어 검색" />
      )}
      <Title>{title}</Title>
      <Sub>{sub}</Sub>
    </Container>
  );
};

export default ChatWidgetB;
