import * as F from "@routes/scan/ScanFailStyle";
import FailIconImg from "@assets/cam_notice.svg";
import { useNavigate } from "react-router-dom";

const ScanFail = () => {
  const navigate = useNavigate();

  const handleNavigateToScan = () => {
    navigate("/scan");
  };

  const handleNavigateToChat = () => {
    navigate("/chat");
  };
  return (
    <F.Container>
      <F.FailIcon src={FailIconImg} alt="실패 아이콘"></F.FailIcon>
      <F.Text1>사진을 분석하지 못했어요</F.Text1>
      <F.Text2>다시 촬영하거나, 챗봇에게 물어볼 수 있어요</F.Text2>
      <F.ButtonWrapper>
        <F.ScanBtn onClick={handleNavigateToScan}>다시 촬영하기</F.ScanBtn>
        <F.ChatBtn onClick={handleNavigateToChat}>챗봇에게 물어보기</F.ChatBtn>
      </F.ButtonWrapper>
    </F.Container>
  );
};
export default ScanFail;
