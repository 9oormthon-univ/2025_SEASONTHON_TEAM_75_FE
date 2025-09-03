import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./LocationSearchStyle";
import Header from "@components/Header";
import SearchIcon from "@/assets/search.svg";
import XIcon from "@/assets/search_x.svg";
import LocationSearchItem from "@components/location/LocationSearchItem";

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

  // sig.json 데이터 저장
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
    if (!keyword) {
      return [];
    }
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
