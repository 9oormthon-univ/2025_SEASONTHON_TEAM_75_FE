import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "@routes/partner/ScanStyle";
import CloseImg from "@assets/cam_close.svg";
import QrScanner from "qr-scanner";

const Scan: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const isScannedRef = useRef(false);
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
          if (!isScannedRef.current) {
            try {
              const url = new URL(result.data);
              const userCouponId = url.searchParams.get("userCouponId");
              const qrToken = url.searchParams.get("qrToken");

              if (userCouponId && qrToken) {
                isScannedRef.current = true;
                navigate("/partner/scan/loading", {
                  state: {
                    userCouponId: parseInt(userCouponId, 10),
                    qrToken: qrToken,
                  },
                });
              }
            } catch (error) {
              isScannedRef.current = true;
              navigate("/partner/scan/fail", {
                state: { message: "유효하지 않은 쿠폰 QR입니다." },
                replace: true,
              });
            }
          }
        },
        QrOptions,
      );

      qrScanner.start().catch((err) => {
        console.error("카메라 권한 에러:", err);
        alert("카메라 권한을 허용해주세요.");
        navigate("/partner/home");
      });
    }

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [navigate]);

  return (
    <S.Container>
      <S.Video ref={videoRef} autoPlay playsInline muted />
      <S.Overlay />
      <S.ScanBox />
      <S.Header>
        <S.CloseButton onClick={() => navigate("/partner/home")}>
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
