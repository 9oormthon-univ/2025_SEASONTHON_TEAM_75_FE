import { useState, useEffect } from "react";
import * as L from "@routes/scan/ScanLoadingStyle";
import Lottie from "lottie-react";
import loadingAnimation from "@assets/search.json";

const ScanLoading = () => {
  const [displayText, setDisplayText] = useState(
    "분리특공대가 올바른<br/>분리수거 가이드를 찾는 중이에요"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText("거의 다 왔어요!<br/>쓰레기 버릴 준비 됐나요?");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    style: { width: "350px" },
  };

  return (
    <L.Container>
      <Lottie {...lottieOptions} />
      <L.Text1>
        <span dangerouslySetInnerHTML={{ __html: displayText }} />
      </L.Text1>
    </L.Container>
  );
};

export default ScanLoading;
