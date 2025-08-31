import styled from "styled-components";
import HomeIcon from "@assets/home_2.svg";
import HomeSelectIcon from "@assets/home_b.svg";
import OfficeIcon from "@assets/office_2.svg";
import OfficeSelectIcon from "@assets/office_b.svg";
import OtherIcon from "@assets/other_2.svg";
import OtherSelectIcon from "@assets/other_b.svg";
import XIcon from "@assets/x.svg";

export interface LocationListProps {
  id: string | number;
  type: "집" | "회사" | "기타";
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
      $selected ? theme.colors.button : theme.colors.text4};

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
  type,
  title,
  selected,
  onClick,
  onRemove,
}: LocationListProps) {
  const iconMap = {
    집: selected ? HomeSelectIcon : HomeIcon,
    회사: selected ? OfficeSelectIcon : OfficeIcon,
    기타: selected ? OtherSelectIcon : OtherIcon,
  } as const;

  return (
    <List $selected={selected} onClick={onClick}>
      <img className="icon" src={iconMap[type]} alt={type} />
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
