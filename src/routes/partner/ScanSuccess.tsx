import * as F from "@routes/partner/ScanFailStyle";
import SuccessIconImg from "@assets/pt_scan_s.svg";
import { useNavigate } from "react-router-dom";

const ScanSuccess = () => {
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate("/partner/home");
  };

  return (
    <F.Container>
      <F.Icon src={SuccessIconImg} alt="성공 아이콘"></F.Icon>
      <F.Text1>10% 할인쿠폰을 적용해주세요!</F.Text1>
      <F.Text2>사용할 수 있는 쿠폰이에요</F.Text2>

      <F.ScanBtn onClick={handleNavigateToHome}>완료</F.ScanBtn>
    </F.Container>
  );
};
export default ScanSuccess;
