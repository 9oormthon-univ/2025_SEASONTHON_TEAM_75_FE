import styled from "styled-components";
import LocationIcon from "@assets/setting_location.svg";
import MicIcon from "@assets/setting_mic.svg";
import SavedIcon from "@assets/setting_saved.svg";
import AlertIcon from "@assets/setting_alert.svg";

interface ToggleProps {
  type: "location" | "mic" | "saved" | "alert";
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 24px;
    height: 24px;
  }

  p {
    color: ${({ theme }) => theme.colors.text1};
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.16px;
    margin: 0;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 45px;
  height: 28px;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.main};
  }

  &:checked + span:before {
    transform: translateX(17px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.text4};
  transition: 0.3s;
  border-radius: 14px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const ToggleListItem = ({ type }: ToggleProps) => {
  const mapping = {
    location: { icon: LocationIcon, title: "위치 권한 설정" },
    mic: { icon: MicIcon, title: "음성 권한 설정" },
    saved: { icon: SavedIcon, title: "최근 기록 저장 설정" },
    alert: { icon: AlertIcon, title: "알림 설정" },
  };

  const { icon, title } = mapping[type];

  return (
    <Container>
      <Left>
        <img src={icon} alt={title} />
        <p>{title}</p>
      </Left>
      <Switch>
        <Checkbox />
        <Slider />
      </Switch>
    </Container>
  );
};

export default ToggleListItem;
