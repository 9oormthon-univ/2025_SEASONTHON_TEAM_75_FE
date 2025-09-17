import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDistricts, useDistrictActions } from "@stores/userDistrictStore";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;

  @media screen and (min-width: 1025px) {
    width: 393px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  width: 145px;
  position: absolute;
  top: calc(24px + 2rem);
  right: 1.5rem;
  gap: 5px;
`;

interface OptionProps {
  isSelected: boolean;
}

export const Option = styled.div<OptionProps>`
  font-family: "Pretendard";
  font-size: 16px;
  cursor: pointer;

  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text1 : theme.colors.text3};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 500)};
`;

export const GoToLocation = styled(Option)`
  &:active {
    color: ${({ theme }) => theme.colors.text1};
    font-weight: 600;
  }
`;

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationSelectModal = ({ isOpen, onClose }: LocationSelectModalProps) => {
  const navigate = useNavigate();
  const districts = useDistricts();
  const { changeDefault } = useDistrictActions();

  if (!isOpen) {
    return null;
  }

  const handleSetDefault = async (id: number) => {
    await changeDefault(id);
    onClose();
  };

  const handleNavigate = () => {
    navigate("/location", { state: { from: "home" } });
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {districts.map((district) => {
          const locString = `${district.response.sigugn} ${district.response.eupmyeondong}`;
          return (
            <Option
              key={district.userDistrictId}
              isSelected={district.isDefault}
              onClick={() => handleSetDefault(district.userDistrictId)}
            >
              {locString}
            </Option>
          );
        })}
        <GoToLocation isSelected={false} onClick={handleNavigate}>
          내 동네 설정
        </GoToLocation>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LocationSelectModal;
