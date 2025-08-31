import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

const Map = () => {
  const center = { lat: 37.525121, lng: 126.96339 };

  const [myLocation, setMyLocation] = useState(center);

  useKakaoLoader({
    appkey: "80cb5b35a62a8e1d170add82632d9002",
    libraries: ["services"],
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("위치 접근 실패:", err);
        alert("위치 정보를 가져오는 데 실패했습니다.");
      }
    );
  }, []);

  return <div>자치구 설정 페이지</div>;
};
export default Map;
