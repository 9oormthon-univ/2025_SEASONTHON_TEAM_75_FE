import { useState, useEffect } from "react";
import * as L from "@routes/scan/ScanLoadingStyle";
import LogoImg from "@assets/loading_logo.svg";
import Typewriter from "typewriter-effect";

const ScanLoading = () => {
  const [displayText, setDisplayText] = useState(
    "분리특공대가 올바른<br/>분리수거 가이드를 찾는 중이에요"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText("거의 다 왔어요!<br/>쓰레기 버릴 준비 됐나요?");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <L.Container>
      <L.Logo src={LogoImg} alt="로고"></L.Logo>
      <L.Text1>
        <Typewriter
          key={displayText}
          onInit={(typewriter) => {
            typewriter.typeString(displayText).start();
          }}
          options={{
            loop: true,
            delay: 80,
            autoStart: true,
          }}
        />
      </L.Text1>
    </L.Container>
  );
};

export default ScanLoading;
