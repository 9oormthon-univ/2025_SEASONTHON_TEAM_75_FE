import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Scan: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    navigate("/edit", { state: { photo: dataUrl } });
  };

  return (
    <div>
      <h1>촬영 페이지</h1>
      <button onClick={startCamera}>카메라 시작</button>
      <button onClick={takePhoto}>사진 찍기</button>
      <video ref={videoRef} autoPlay width={"100%"} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Scan;
