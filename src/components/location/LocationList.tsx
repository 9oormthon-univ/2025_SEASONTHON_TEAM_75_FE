import styled from "styled-components";
import XIcon from "@assets/x.svg";

export interface LocationListProps {
  id: string | number;
  title: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: (id: string | number) => void;
}

const List = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;

  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.button : theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? "700" : "500")};

  padding: 20px;
  border-radius: 15px;
  border: ${({ $selected }) => ($selected ? "1.5px" : "1px")} solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.main : theme.colors.text4};

  img {
    width: 19px;
    height: 19px;
  }

  p {
    width: 100%;
  }

  button {
    all: unset;
    display: flex;
    align-items: center;
  }
`;

function LocationList({
  id,
  title,
  selected,
  onClick,
  onRemove,
}: LocationListProps) {
  return (
    <List $selected={selected} onClick={onClick}>
      <p>{title}</p>
      <button
        aria-label="삭제"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(id);
        }}
      >
        <img src={XIcon} alt="삭제" />
      </button>
    </List>
  );
}

export default LocationList;
