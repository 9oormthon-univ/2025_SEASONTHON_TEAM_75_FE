import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./LocationSearchStyle";
import Header from "@components/Header";
import SearchIcon from "@/assets/search.svg";
import XIcon from "@/assets/search_x.svg";
import ScopeIcon from "@/assets/scope.svg";
import LocationSearchItem from "@components/location/LocationSearchItem";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import apiClient from "@utils/apiClient";
import MainButton from "@components/MainButton";

type District = {
  districtId: string;
  sido: string;
  sigugn: string;
  eupmyeondong: string;
};

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
  const navigate = useNavigate();

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [keyword, setKeyword] = useState("");

  // 선택된 자치구
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  const [results, setResults] = useState<District[]>([]); // api 응답

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ["services"],
  });

  const [sigunguList, setSigunguList] = useState<Sigungu[]>([]);
  useEffect(() => {
    // sigunguList 미사용 (임시)
    if (sigunguList.length) void sigunguList[0];
  }, [sigunguList]);

  useEffect(() => {
    if (error) {
      console.error("카카오 SDK 로드 실패:", error);
    }
    if (loading) {
      console.log("카카오 SDK 로딩중:", loading);
    }
  }, [error, loading]);

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

  const handleSearch = async () => {
    const parts = keyword.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return;

    setSelectedDistrict(null);

    try {
      if (parts.length >= 2) {
        const { data } = await apiClient.get("/api/v1/districts", {
          params: { sido: parts[0], sigungu: parts.slice(1).join(" ") },
        });
        setResults(data?.data ?? []);
        return;
      }

      // 한 단어
      const q = parts[0];
      const [bySido, bySigungu] = await Promise.all([
        apiClient.get("/api/v1/districts", { params: { sido: q } }),
        apiClient.get("/api/v1/districts", { params: { sigungu: q } }),
      ]);

      const merged: District[] = [
        ...(bySido.data?.data ?? []),
        ...(bySigungu.data?.data ?? []),
      ];

      // 중복 제거
      const unique = Object.values(
        merged.reduce(
          (acc, d) => ((acc[d.districtId] = d), acc),
          {} as Record<string, District>
        )
      );

      setResults(unique);
    } catch (e) {
      console.error("검색 실패:", e);
      setResults([]);
    }
  };

  // 리스트에서 선택
  const handlePick = async (d: District) => {
    try {
      await apiClient.post(`/api/v1/users/districts/${d.districtId}`);

      const label = [d.sido, d.sigugn, d.eupmyeondong]
        .filter(Boolean)
        .join(" ");

      navigate("/location", {
        replace: true,
        state: {
          source: "location_search",
          setup: false,
          selected: label,
        },
      });
    } catch (e) {
      console.error("자치구 등록 실패:", e);
    }
  };

  // 현재 위치로 찾기
  const handleCurrentPick = async () => {
    console.log("현재 위치로 찾기");
  };

  // 키보드 설정
  const handleFocus = () => setIsSearchMode(true);
  const handleBlur = () => {
    if (keyword.trim().length === 0) setIsSearchMode(false);
  };
  const handleChange = (v: string) => {
    setKeyword(v);

    if (v.trim().length === 0) {
      setIsSearchMode(false);
      setResults([]);
      setSelectedDistrict(null);
    } else {
      setIsSearchMode(true);
    }
  };

  return (
    <L.Page>
      <Header title="내 동네 설정" isBackButton={true} />

      <L.SearchBox>
        <img src={SearchIcon} alt="검색" />
        <input
          type="text"
          placeholder="내 동네를 검색하세요"
          value={keyword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        {keyword && (
          <button
            onClick={() => {
              setKeyword("");
              setResults([]);
              setSelectedDistrict(null);
              setIsSearchMode(false);
            }}
          >
            <img src={XIcon} alt="취소" />
          </button>
        )}
      </L.SearchBox>

      {!isSearchMode && (
        <L.Now onClick={handleCurrentPick}>
          <img src={ScopeIcon} alt="현재 위치" />
          <p>현재 위치로 찾기</p>
        </L.Now>
      )}

      <L.SearchList>
        {results.map((d) => {
          const label = [d.sido, d.sigugn, d.eupmyeondong]
            .filter(Boolean)
            .join(" ");
          return (
            <LocationSearchItem
              key={d.districtId}
              title={label}
              isSelected={selectedDistrict?.districtId === d.districtId}
              onClick={() => setSelectedDistrict(d)}
            />
          );
        })}
      </L.SearchList>

      <L.Button>
        <MainButton
          title="등록"
          disabled={!selectedDistrict}
          onClick={() => {
            if (selectedDistrict) {
              handlePick(selectedDistrict);
            }
          }}
        />
      </L.Button>
    </L.Page>
  );
};

export default LocationSearch;
