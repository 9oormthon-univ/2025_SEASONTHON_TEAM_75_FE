import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// Kakao 지오코더 관련
type RegionCodeResultLike = {
  region_type: "B" | "H";
  code: string;
  address_name: string;
};
type JibunLike = {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  main_address_no: string;
  sub_address_no?: string | null;
};
type AddressResultLike = {
  address?: JibunLike | null;
};

// Kakao 지오코더 최소 인터페이스
type GeocoderLike = {
  coord2RegionCode: (
    lng: number,
    lat: number,
    cb: (result: RegionCodeResultLike[], status: string) => void
  ) => void;
  coord2Address: (
    lng: number,
    lat: number,
    cb: (result: AddressResultLike[], status: string) => void
  ) => void;
};

// 지오코더
function getGeocoder(): GeocoderLike | null {
  const w = window as unknown as {
    kakao?: { maps?: { services?: { Geocoder: new () => GeocoderLike } } };
  };
  if (!w.kakao?.maps?.services) return null;
  return new w.kakao.maps.services.Geocoder();
}

// 현재 위치
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Geolocation를 지원하지 않습니다."));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });
}

// 주소 정보
type ReverseRegion = {
  bcode?: string; // 법정동 코드
  hcode?: string; // 행정동 코드
  addressName?: string; // 전체 주소
  sido?: string;
  sigungu?: string;
  eupmyeondong?: string;
  jibunAddress?: string; // 지번 전체 주소
  roadAddress?: string; // 도로명 전체 주소
};

async function reverseFromCoord(
  lat: number,
  lng: number
): Promise<ReverseRegion> {
  const geocoder = getGeocoder();
  if (!geocoder) throw new Error("카카오 지오코더가 아직 로드되지 않았습니다.");

  // 법정/행정 코드
  const region = await new Promise<RegionCodeResultLike[]>((res, rej) => {
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === "OK") res(result);
      else rej(new Error("coord2RegionCode 실패: " + status));
    });
  });

  const legal = region.find((r) => r.region_type === "B"); // 법정동

  // 지번/도로명 주소
  const addr = await new Promise<AddressResultLike[]>((res, rej) => {
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === "OK") res(result);
      else rej(new Error("coord2Address 실패: " + status));
    });
  });

  const jibun = addr.find((a) => a.address)?.address ?? undefined;

  // 시/구/동
  const parts = (legal?.address_name ?? "").split(" ").filter(Boolean);
  const sido = parts[0];
  // 2단계 비어있는 경우
  const sigungu = parts.length >= 3 ? parts[1] : parts[1] ?? undefined;
  const eupmyeondong = parts.length >= 3 ? parts[2] : parts[2] ?? undefined;

  return {
    bcode: legal?.code,
    addressName: legal?.address_name,
    sido,
    sigungu,
    eupmyeondong,
    jibunAddress: jibun
      ? `${jibun.region_1depth_name} ${jibun.region_2depth_name} ${
          jibun.region_3depth_name
        } ${jibun.main_address_no}${
          jibun.sub_address_no ? "-" + jibun.sub_address_no : ""
        }`
      : undefined,
  };
}

const LocationSearch = () => {
  const navigate = useNavigate();
  const { state: navState } = useLocation() as {
    state?: { from?: "home" | "profile_complete" };
  };
  const from = navState?.from;

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
          from,
        },
      });
    } catch (e) {
      console.error("자치구 등록 실패:", e);
    }
  };

  // 현재 위치로 찾기
  const handleCurrentPick = async () => {
    try {
      // 현재 좌표
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;

      //
      const info = await reverseFromCoord(latitude, longitude);

      if (!info.bcode) {
        console.error("법정동 코드(bcode)를 찾지 못했습니다.", info);
        return;
      }

      // 법정코드로 바로 등록
      await apiClient.post(`/api/v1/users/districts/${info.bcode}`);

      // UI 이동
      const label =
        info.addressName ??
        [info.sido, info.sigungu, info.eupmyeondong].filter(Boolean).join(" ");

      navigate("/location", {
        replace: true,
        state: {
          source: "location_search",
          setup: false,
          selected: label,
          from,
        },
      });
    } catch (e) {
      console.error("현재 위치 등록 실패:", e);
    }
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
