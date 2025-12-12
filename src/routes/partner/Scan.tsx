import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "@routes/partner/ScanStyle";
import CloseImg from "@assets/cam_close.svg";
import QrScanner from "qr-scanner";

const Scan: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [isScanned, setIsScanned] = useState(false);
  const QrOptions = {
    preferredCamera: "environment",
    maxScansPerSecond: 5,
    highlightScanRegion: false,
    highlightCodeOutline: false,
  };

  useEffect(() => {
    const videoElem = videoRef.current;
    let qrScanner: QrScanner | null = null;

    if (videoElem) {
      qrScanner = new QrScanner(
        videoElem,
        (result) => {
          if (!isScanned) {
            console.log("QR 스캔 결과: ", result.data);
            setIsScanned(true);
            navigate("/partner/scan/loading", {
              state: { code: result.data },
            });
          }
        },
        QrOptions
      );

      qrScanner.start().catch((err) => {
        console.error("카메라 권한 에러:", err);
        alert("카메라 권한을 허용해주세요.");
        navigate(-1);
      });
    }

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [navigate, isScanned]);

  return (
    <S.Container>
      <S.Video ref={videoRef} autoPlay playsInline muted />
      <S.Overlay />
      <S.ScanBox />
      <S.Header>
        <S.CloseButton onClick={() => navigate(-1)}>
          <img src={CloseImg} alt="닫기" />
        </S.CloseButton>
        <S.Title>
          고객님께
          <br />
          할인쿠폰 QR을 요청하세요!
        </S.Title>
      </S.Header>
    </S.Container>
  );
};

export default Scan;
