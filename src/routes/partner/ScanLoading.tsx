import * as L from "@routes/partner/ScanLoadingStyle";
import Lottie from "lottie-react";
import loadingAnimation from "@assets/search.json";

const ScanLoading = () => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    style: { width: "350px" },
  };

  return (
    <L.Container>
      <Lottie {...lottieOptions} />
      <L.Text>
        QR을 확인하고 있어요...<div>잠시만 기다려주세요</div>
      </L.Text>
    </L.Container>
  );
};

export default ScanLoading;
