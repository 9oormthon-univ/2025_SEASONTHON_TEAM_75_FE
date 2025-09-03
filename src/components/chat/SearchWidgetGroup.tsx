import styled from "styled-components";
import { useState } from "react";
import ChatWidgetB from "@components/chat/ChatWidgetB";

type Props = {
  actions: {
    selectSearchMode: (mode: "word" | "category", title: string) => void;
    setSelectedMode: (mode: "word" | "category" | null) => void;
  };
};

const Container = styled.div`
  position: relative;
  display: flex;
  gap: 10px;
`;

const SearchWidgetGroup: React.FC<Props> = ({ actions }) => {
  const [selected, setSelected] = useState<"word" | "category" | null>(null);

  const handleClick = (mode: "word" | "category", title: string) => {
    setSelected(mode);
    actions.selectSearchMode(mode, title);
    actions.setSelectedMode(mode);
  };

  return (
    <Container>
      <ChatWidgetB
        title="단어 검색"
        sub="원하는 품목을 검색하세요."
        selected={selected === "word"}
        onClick={() => handleClick("word", "단어 검색")}
      />
      <ChatWidgetB
        title="카테고리 검색"
        sub="종류별로 찾아보세요."
        selected={selected === "category"}
        onClick={() => handleClick("category", "카테고리 검색")}
      />
    </Container>
  );
};

export default SearchWidgetGroup;
