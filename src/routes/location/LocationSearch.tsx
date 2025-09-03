import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./LocationSearchStyle";
import Header from "@components/Header";
import SearchIcon from "@/assets/search.svg";
import XIcon from "@/assets/search_x.svg";
import ScopeIcon from "@/assets/scope.svg";
import LocationSearchItem from "@components/location/LocationSearchItem";
import { useKakaoLoader } from "react-kakao-maps-sdk";

type Sigungu = {
  code: string;
  name: string;
};

type GeoJSONFeature = {
  type: "Feature";
  properties: { SIG_CD: string; SIG_KOR_NM: string };
};
type GeoJSON = { type: "FeatureCollection"; features: GeoJSONFeature[] };

const LocationSearch = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ["services"],
  });

  const [sigunguList, setSigunguList] = useState<Sigungu[]>([]);

  useEffect(() => {
    fetch("/sig.json")
      .then((res) => res.json())
      .then((data: GeoJSON) => {
        const list = data.features.map((feature) => ({
          code: feature.properties.SIG_CD,
          name: feature.properties.SIG_KOR_NM,
        }));
        setSigunguList(list);
      })
      .catch((e) => console.error("sig.json 로드 실패:", e));
  }, []);

  const filteredList = useMemo(() => {
    if (!keyword) return [];
    return sigunguList.filter((sgg) => sgg.name.includes(keyword));
  }, [keyword, sigunguList]);

  const handlePick = (title: string, sigCode: string) => {
    navigate("/location", {
      state: {
        source: "location_search",
        setup: true,
        selected: title,
        sigCode: sigCode,
      },
    });
  };

  const handleFindByCurrentLocation = () => {
    if (loading || error) {
      alert(
        "지도 서비스 로딩 중이거나 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const region = result.find(
                (r) => r.region_type === "H" || r.region_type === "B"
              );
              if (region) {
                const title = region.address_name;
                const sigCode = region.code.slice(0, 5);
                handlePick(title, sigCode);
              } else {
                alert("현재 위치의 지역 정보를 찾을 수 없습니다.");
              }
            } else {
              alert("현재 위치의 지역 정보를 가져오는 데 실패했습니다.");
            }
          });
        },
        (err) => {
          console.error(err);
          alert(
            "위치 정보를 가져오는 데 실패했습니다. 위치 정보 접근을 허용했는지 확인해주세요."
          );
        }
      );
    } else {
      alert("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
    }
  };

  return (
    <L.Page>
      <Header title={"내 동네 설정"} onBack={() => navigate(-1)} />

      <L.SearchBox>
        <img src={SearchIcon} alt="검색" />
        <input
          type="text"
          placeholder="내 동네를 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button onClick={() => setKeyword("")}>
            <img src={XIcon} alt="취소" />
          </button>
        )}
      </L.SearchBox>

      <L.Now onClick={handleFindByCurrentLocation}>
        <img src={ScopeIcon} alt="현재 위치" />
        <p>현재 위치로 찾기</p>
      </L.Now>

      <L.SearchList>
        {filteredList.map((sgg) => (
          <LocationSearchItem
            key={sgg.code}
            title={sgg.name}
            onClick={() => handlePick(sgg.name, sgg.code)}
          />
        ))}
      </L.SearchList>
    </L.Page>
  );
};

export default LocationSearch;
