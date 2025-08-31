import styled from "styled-components";
import HomeIcon from "@assets/home_3.svg";
import HomeSelectIcon from "@assets/home_1.svg";
import OfficeIcon from "@assets/office_3.svg";
import OfficeSelectIcon from "@assets/office_1.svg";
import OtherIcon from "@assets/other_3.svg";
import OtherSelectIcon from "@assets/other_1.svg";

export interface LocationSelectProps {
  title: "집" | "회사" | "기타";
  selected?: boolean;
  onClick?: () => void;
}

const Button = styled.button<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 15px 12px;

  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.text1 : theme.colors.text3};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;

  border-radius: 15px;
  border: solid 1px currentColor;

  &:hover,
  &:active,
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
    border-color: currentColor;
  }
`;

function LocationSelectButton({
  title,
  selected,
  onClick,
}: LocationSelectProps) {
  const iconMap: Record<
    LocationSelectProps["title"],
    { on: string; off: string }
  > = {
    집: { on: HomeSelectIcon, off: HomeIcon },
    회사: { on: OfficeSelectIcon, off: OfficeIcon },
    기타: { on: OtherSelectIcon, off: OtherIcon },
  };

  const icon = selected ? iconMap[title].on : iconMap[title].off;

  return (
    <Button $selected={selected} onClick={onClick}>
      <img src={icon} alt={title} />
      <p>{title}</p>
    </Button>
  );
}

export default LocationSelectButton;
