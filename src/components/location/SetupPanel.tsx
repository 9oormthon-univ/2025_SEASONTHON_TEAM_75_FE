import * as L from "../../routes/location/LocationStyle";
import MainButton from "@components/MainButton";
import WarnIcon from "@assets/warning.svg";

interface SetupPanelProps {
  selectedTitle?: string;
  onRegister: () => void;
}

export default function SetupPanel({
  selectedTitle,
  onRegister,
}: SetupPanelProps) {
  return (
    <L.Bottom $setup>
      <p>{selectedTitle ?? "선택한 동네"}</p>
      <L.Warn>
        <img src={WarnIcon} alt="경고" />
        <p>지도의 표시와 실제 주소가 맞는지 확인해주세요.</p>
      </L.Warn>
      <MainButton title="등록" onClick={onRegister} />
    </L.Bottom>
  );
}
