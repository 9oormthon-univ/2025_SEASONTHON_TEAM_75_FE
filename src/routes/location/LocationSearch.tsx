import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as L from "./LocationSearchStyle";
import Header from "@components/Header";
import SearchIcon from "@/assets/search.svg";
import XIcon from "@/assets/search_x.svg";
import ScopeIcon from "@/assets/scope.svg";
import LocationSearchItem from "@components/location/LocationSearchItem";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import MainButton from "@components/MainButton";
import { useDistrictActions } from "@stores/userDistrictStore";
import type { Location } from "@types";
import { useDistrictSearch } from "@utils/location/useDistrictSearch";
import { useCurrentDistrict } from "@utils/location/useCurrentDistrict";

const LocationSearch = () => {
  const { setDistrict } = useDistrictActions();

  const navigate = useNavigate();
  const { state: navState } = useLocation() as {
    state?: { from?: "home" | "profile_complete" };
  };
  const from = navState?.from;

  // 커스텀 훅
  const {
    keyword,
    setKeyword,
    results,
    selected,
    setSelected,
    searching,
    hasSearched,
    search,
    reset,
  } = useDistrictSearch();

  const {
    resolveCurrentDistrict,
    loading: currentLoading,
    error: currentError,
  } = useCurrentDistrict();

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ["services"],
  });

  useEffect(() => {
    if (error) console.error("카카오 SDK 로드 실패:", error);
    if (loading) console.log("카카오 SDK 로딩중:", loading);
    if (currentError) console.error("현재 위치 해석 실패:", currentError);
  }, [error, loading, currentError]);

  // 리스트에서 선택
  const handlePick = async (d: Location) => {
    try {
      const result = await setDistrict(d);
      if (!result.ok) return;

      navigate("/location", {
        replace: true,
        state: {
          source: "location_search",
          setup: false,
          selected: result.label,
          from,
        },
      });
    } catch (e) {
      console.error("자치구 등록 실패:", e);
    }
  };

  // 현재 위치로 찾기
  const handleCurrentPick = async () => {
    const result = await resolveCurrentDistrict();
    if (!result) return;

    if (result.ok) {
      navigate("/location", {
        replace: true,
        state: {
          source: "location_search",
          setup: true,
          selected: result.label,
          districtId: result.districtId,
          sigCode: result.sigCode,
          from,
        },
      });
    }
  };

  return (
    <L.Page>
      <Header title="내 동네 설정" isBackButton={true} />

      <L.SearchBox>
        <img src={SearchIcon} alt="검색" />
        <input
          type="text"
          placeholder="시군구 단위로 검색해 주세요"
          value={keyword}
          onFocus={() => {}}
          onBlur={() => {
            if (keyword.trim().length === 0) {
              reset();
            }
          }}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        {keyword && (
          <button onClick={reset}>
            <img src={XIcon} alt="취소" />
          </button>
        )}
      </L.SearchBox>

      {!keyword && (
        <L.Now onClick={handleCurrentPick} aria-busy={currentLoading}>
          <img src={ScopeIcon} alt="현재 위치" />
          <p>{currentLoading ? "현재 위치 확인 중..." : "현재 위치로 찾기"}</p>
        </L.Now>
      )}

      {/* 검색 결과 없을 때 */}
      {!searching && hasSearched && results.length === 0 && (
        <L.Empty>
          {
            "현재는 일부 지역만 지원중이에요.\n다른 지역이 업데이트되면 알려드릴게요!\n\n(검색 예시: 서울특별시, 서울, 마포 ...)"
          }
        </L.Empty>
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
              isSelected={selected?.districtId === d.districtId}
              onClick={() => setSelected(d)}
            />
          );
        })}
      </L.SearchList>

      <L.Button>
        <MainButton
          title="등록"
          disabled={!selected}
          onClick={() => selected && handlePick(selected)}
        />
      </L.Button>
    </L.Page>
  );
};

export default LocationSearch;
