import { useState } from "react";
import ChatWidgetS from "./ChatWidgetS";
import styled from "styled-components";

type Item = { id: number; name: string };

type Props = {
  payload?: Item[];
  actions: {
    selectTrashItem: (item: { id: number; name: string }) => void;
  };
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TrashItemWidgetGroup: React.FC<Props> = ({ payload = [], actions }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleClick = (item: Item) => {
    setSelectedId(item.id);
    actions.selectTrashItem({ id: item.id, name: item.name });
  };

  return (
    <Container>
      {payload.map((it) => (
        <ChatWidgetS
          key={it.id}
          title={it.name}
          selected={selectedId === it.id}
          onClick={() => handleClick(it)}
        />
      ))}
    </Container>
  );
};

export default TrashItemWidgetGroup;
