import * as F from "@routes/partner/ScanFailStyle";
import FailIconImg from "@assets/cam_notice.svg";
import { useNavigate } from "react-router-dom";

const ScanFail = () => {
  const navigate = useNavigate();

  const handleNavigateToScan = () => {
    navigate("/partner/scan");
  };

  return (
    <F.Container>
      <F.Icon src={FailIconImg} alt="실패 아이콘"></F.Icon>
      <F.Text1>쿠폰을 적용할 수 없어요.</F.Text1>
      <F.Text2>이미 사용된 쿠폰이거나, 내 브랜드 쿠폰이 아니에요.</F.Text2>

      <F.ScanBtn onClick={handleNavigateToScan}>다시 촬영하기</F.ScanBtn>
    </F.Container>
  );
};
export default ScanFail;
