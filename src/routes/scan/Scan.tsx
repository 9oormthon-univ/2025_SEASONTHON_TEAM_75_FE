import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "@routes/scan/ScanStyle";
import CloseImg from "@assets/cam_close.svg";
import GalleryImg from "@assets/gallery.svg";
import ChangeCameraImg from "@assets/cam_change.svg";
import ShutterImg from "@assets/cam_shutter.svg";
import heic2any from "heic2any";
import apiClient from "@utils/apiClient";

const Scan: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [cameraFacingMode, setCameraFacingMode] = useState<
    "user" | "environment"
  >("environment");
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      setIsCameraReady(false);

      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          setCurrentStream(stream);

          video.oncanplay = () => {
            console.log("비디오 프레임 준비 완료, 촬영 가능");
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 권한을 확인해주세요.");
        navigate(-1);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current) {
        videoRef.current.oncanplay = null;
      }
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacingMode]);

  const processImageAndNavigate = async (
    imageFile: File,
    imageDataUrl: string
  ) => {
    navigate("/scan/loading");

    const formData = new FormData();
    formData.append("imageFile", imageFile);

    try {
      const response = await apiClient.post("/api/v1/trash", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API 응답 성공:", response.data.data.imageUrl);
      navigate(`/scan/result/${response.data.data.id}`, {
        state: {
          apiResult: response.data.data,
          capturedImage: imageDataUrl,
        },
      });
    } catch (error) {
      console.error("API 요청 실패:", error);
      navigate("/scan/fail");
    }
  };

  const takePhoto = () => {
    if (
      !isCameraReady ||
      !videoRef.current ||
      !canvasRef.current ||
      !scanBoxRef.current ||
      videoRef.current.videoWidth === 0
    ) {
      console.warn("카메라가 준비되지 않아 촬영할 수 없습니다.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const scanBox = scanBoxRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = video.clientWidth / video.clientHeight;
    let scale: number;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > containerRatio) {
      scale = video.videoHeight / video.clientHeight;
      offsetX = (video.videoWidth - video.clientWidth * scale) / 2;
    } else {
      scale = video.videoWidth / video.clientWidth;
      offsetY = (video.videoHeight - video.clientHeight * scale) / 2;
    }

    const boxWidthPx = scanBox.clientWidth;
    const boxHeightPx = scanBox.clientHeight;

    const cropX = offsetX + ((video.clientWidth - boxWidthPx) / 2) * scale;
    const cropY = offsetY + ((video.clientHeight - boxHeightPx) / 2) * scale;
    const cropWidth = boxWidthPx * scale;
    const cropHeight = boxHeightPx * scale;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedContext = croppedCanvas.getContext("2d");
    if (croppedContext) {
      croppedContext.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
    }

    const dataUrl = croppedCanvas.toDataURL("image/png");
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        const imageFile = new File([blob], "capture.png", {
          type: "image/png",
        });
        processImageAndNavigate(imageFile, dataUrl);
      }
    }, "image/png");
  };

  const toggleCameraFacingMode = () => {
    setCameraFacingMode((prevMode) =>
      prevMode === "user" ? "environment" : "user"
    );
  };

  const handleGalleryInput = useRef<HTMLInputElement>(null);

  const openGallery = () => {
    handleGalleryInput.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let file = event.target.files?.[0];
    if (!file) return;

    try {
      const isHeic = file.name.toLowerCase().endsWith(".heic");
      let imageFile = file;

      if (isHeic) {
        console.log("HEIC 파일을 감지하여 JPEG로 변환합니다.");
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        imageFile = new File([convertedBlob as Blob], "converted.jpeg", {
          type: "image/jpeg",
        });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        processImageAndNavigate(imageFile, imageDataUrl);
      };
      reader.onerror = () => {
        console.error("파일 리더 오류");
        alert("파일을 읽는 데 실패했습니다.");
      };
      reader.readAsDataURL(imageFile);
    } catch (e) {
      console.error("갤러리 이미지 처리 오류:", e);
      alert("이미지 파일을 처리하는 데 실패했습니다.");
    }
  };

  return (
    <S.Container>
      <S.Video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <S.Overlay />
      <S.ScanBox ref={scanBoxRef} />
      <S.Header>
        <S.Title>스캔</S.Title>
        <S.CloseButton src={CloseImg} alt="닫기" onClick={() => navigate(-1)} />
      </S.Header>
      <S.ButtonContainer>
        <S.ActionButton onClick={openGallery} src={GalleryImg} alt="갤러리" />
        <input
          type="file"
          accept="image/*"
          ref={handleGalleryInput}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <S.CaptureButton onClick={takePhoto} src={ShutterImg} alt="사진 촬영" />

        <S.ActionButton
          onClick={toggleCameraFacingMode}
          src={ChangeCameraImg}
          alt="카메라 전환"
        />
      </S.ButtonContainer>
    </S.Container>
  );
};

export default Scan;
