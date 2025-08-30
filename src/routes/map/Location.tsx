import * as L from "./LocationStyle";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import Header from "@components/Header";
import LocationModal from "@components/LocationModal";
import InfoIcon from "@assets/info.svg";
import PlusIcon from "@assets/plus.svg";

const Location = () => {
  const center = { lat: 37.525121, lng: 126.96339 };

  const [myLocation, setMyLocation] = useState(center);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
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

  // 모달 닫기
  const handleCancel = () => setIsModalOpen(false);

  // 확인 버튼
  const handleConfirm = () => {
    console.log("내 위치 등록");
  };

  return (
    <L.Page>
      <Header
        title={"내 동네 설정"}
        onBack={() => console.log("뒤로가기")}
        rightButton={
          <button onClick={() => console.log("정보")}>
            <img src={InfoIcon} alt="정보" />
          </button>
        }
      />

      <Map
        center={myLocation}
        level={5}
        style={{ width: "100%", height: "100%" }}
      >
        <MapMarker position={myLocation} />
      </Map>

      <L.Bottom>
        <p>내 동네</p>
        <L.ButtonGroup>
          <L.AddButton>
            <img src={PlusIcon} alt="추가" />
            <p>동네 추가하기</p>
          </L.AddButton>
        </L.ButtonGroup>
      </L.Bottom>

      <LocationModal
        title={"현재 내 위치 '마포구'\n등록할까요?"}
        confirmText="확인"
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </L.Page>
  );
};
export default Location;
