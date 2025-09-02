import VinylIcon from "@assets/vinyl.svg";
import PetIcon from "@assets/pet.svg";
import RecyclingIcon from "@assets/recycling.svg";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
`;

export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const TrashImage = styled.img`
  width: 63px;
  height: 63px;
  object-fit: cover;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 18px;
`;

export const Type = styled.div`
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Icon = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 5px;
`;

interface PartCardProps {
  type: string;
  name: string;
}

const PartCard = ({ type, name }: PartCardProps) => {
  const getMainIconForType = () => {
    switch (type) {
      case "PET(투명페트병)":
        return PetIcon;
      case "비닐류":
        return VinylIcon;
      default:
        return PetIcon;
    }
  };

  return (
    <Container>
      <LeftSection>
        <TrashImage src={getMainIconForType()} alt={type} />
        <InfoWrapper>
          <Name>{name}</Name>
          <Type>
            <Icon src={RecyclingIcon} alt="재활용 아이콘" />
            {type}
          </Type>
        </InfoWrapper>
      </LeftSection>
    </Container>
  );
};

export default PartCard;
