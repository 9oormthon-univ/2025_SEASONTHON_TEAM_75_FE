import styled from "styled-components";
import CheckIcon from "@assets/location_check.svg";

interface LocationSearchProps {
  title: string;
  isSelected: boolean;
  onClick?: () => void;
}

const SearchItem = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.text1 : theme.colors.text2};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? "700" : "500")};

  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text5};
`;

function LocationSearchItem({
  title,
  isSelected,
  onClick,
}: LocationSearchProps) {
  return (
    <SearchItem onClick={onClick} $selected={isSelected}>
      {title}

      {isSelected && <img src={CheckIcon} alt="선택" />}
    </SearchItem>
  );
}

export default LocationSearchItem;
