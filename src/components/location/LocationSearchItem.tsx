import styled from "styled-components";

interface LocationSearchProps {
  title: string;
  onClick?: () => void;
}

const SearchItem = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;

  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text5};
`;

function LocationSearchItem(props: LocationSearchProps) {
  return <SearchItem onClick={props.onClick}>{props.title}</SearchItem>;
}

export default LocationSearchItem;
