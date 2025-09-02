import * as L from "@routes/scan/ScanLoadingStyle";
import LogoImg from "@assets/loading_logo.svg";

const ScanLoading = () => {
  return (
    <L.Container>
      <L.Logo src={LogoImg} alt="로고"></L.Logo>
      <L.Text1>{`분리특공대가 올바른\n분리수거 가이드를 찾는 중이에요`}</L.Text1>
      <L.Text2>잠시만 기다려주세요</L.Text2>
    </L.Container>
  );
};

export default ScanLoading;
