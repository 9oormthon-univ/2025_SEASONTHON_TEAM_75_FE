import { useState } from "react";
import ChatWidgetS from "./ChatWidgetS";
import styled from "styled-components";

type Item = {
  id: number;
  code: string;
  name: string;
};

type Props = {
  payload?: Item[]; // 카테고리 배열
  actions: {
    selectTrashCategory: (category: string) => void;
  };
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TrashWidgetGroup: React.FC<Props> = ({ payload = [], actions }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCategoryClick = (item: Item) => {
    setSelectedId(item.id);
    actions.selectTrashCategory(item.name);
  };

  return (
    <Container>
      {payload.map((item) => (
        <ChatWidgetS
          key={item.id}
          title={item.name}
          selected={selectedId === item.id}
          onClick={() => handleCategoryClick(item)}
        />
      ))}
    </Container>
  );
};

export default TrashWidgetGroup;
