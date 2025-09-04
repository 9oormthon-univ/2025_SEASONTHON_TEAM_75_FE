import * as L from "./LocationStyle";
import { Map, MapMarker, Polygon, useKakaoLoader } from "react-kakao-maps-sdk";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@components/Header";
import LocationModal from "@components/location/LocationModal";
import InfoIcon from "@assets/info.svg";
import PlusIcon from "@assets/plus.svg";
import WarnIcon from "@assets/warning.svg";
import LocationList from "@components/location/LocationList";
import MainButton from "@components/MainButton";
import apiClient from "@utils/apiClient";

// 상수
const DEFAULT_CENTER: LatLng = { lat: 37.525121, lng: 126.96339 };

// 타입
type GeocoderStatus = "OK" | "ZERO_RESULT" | "ERROR";
type RegionCodeResult = {
  code: string;
  region_type: string;
  address_name: string;
};

type GeocoderLike = {
  coord2RegionCode: (
    lng: number,
    lat: number,
    cb: (results: RegionCodeResult[], status: GeocoderStatus) => void
  ) => void;
};

type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

// API 타입
type UserDistrict = {
  response: {
    districtId: string;
    sido: string;
    sigugn: string;
    eupmyeondong: string | null;
  };
  userDistrictId: number;
  isDefault: boolean;
};

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;

        LatLngBounds: new () => {
          extend: (latlng: KakaoLatLng) => void;
          getSouthWest: () => KakaoLatLng;
          getNorthEast: () => KakaoLatLng;
        };

        services: {
          Geocoder: new () => GeocoderLike;
        };
      };
    };
  }
}

// GeoJSON
type LngLat = [number, number];
type LinearRing = LngLat[]; // 폐곡선 1개
type PolygonCoords = LinearRing[]; // 외곽 1개 + 홀 n개
type MultiPolygonCoords = PolygonCoords[]; // 폴리곤 n개

type GeoJSONPolygon = { type: "Polygon"; coordinates: PolygonCoords };
type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: MultiPolygonCoords;
};
type GeoJSONGeometry = GeoJSONPolygon | GeoJSONMultiPolygon;

type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: { SIG_CD: string; SIG_KOR_NM: string };
};
type GeoJSON = { type: "FeatureCollection"; features: GeoJSONFeature[] };

type LatLng = { lat: number; lng: number };

function toLatLngPaths(geometry: GeoJSONGeometry): LatLng[][] {
  const polygons: MultiPolygonCoords =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons.flatMap((rings: PolygonCoords) =>
    rings.map((ring: LinearRing) =>
      ring.map(([lng, lat]: LngLat) => ({ lat, lng }))
    )
  );
}

// 라우팅 state
type LocationState = {
  source?: "location_search";
  setup?: boolean;
  selected?: string;
  sigCode?: string;
  districtId?: string;
} | null;

export type MyLocationItem = {
  id: string | number;
  title: string;
  sigCode: string;
};

// Hooks
function useQueryLocationState() {
  const { state } = useLocation() as { state: LocationState };
  const isFromSearch: boolean = state?.source === "location_search";
  return {
    isFromSearch,
    setup: isFromSearch && !!state?.setup,
    selectedTitleFromQuery: isFromSearch ? state?.selected : undefined,
    sigCodeFromQuery: isFromSearch ? state?.sigCode : undefined, // sigCode 추출
    districtIdFromQuery: isFromSearch ? state?.districtId : undefined,
  } as const;
}

function useGeoPosition() {
  const [pos, setPos] = useState<LatLng>(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }
    const id = navigator.geolocation.getCurrentPosition(
      (p: GeolocationPosition) => {
        const { latitude, longitude } = p.coords;
        setPos({ lat: latitude, lng: longitude });
      },
      (err: GeolocationPositionError) => {
        console.error("위치 접근 실패:", err);
        setError("위치 정보를 가져오는 데 실패했습니다.");
      }
    );
    return () => {
      void id;
    };
  }, []);

  return { pos, error } as const;
}

// 내 동네 리스트
interface State {
  items: MyLocationItem[];
  selectedId: string | number | null;
}
type Action =
  | { type: "select"; id: string | number }
  | { type: "remove"; id: string | number }
  | { type: "add"; item: MyLocationItem }
  | { type: "replace"; items: MyLocationItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select": {
      if (state.selectedId === action.id) return state;
      return { ...state, selectedId: action.id };
    }
    case "remove": {
      const nextItems = state.items.filter((i) => i.id !== action.id);
      const nextSelected =
        state.selectedId === action.id
          ? nextItems[0]?.id ?? null
          : state.selectedId;
      return { items: nextItems, selectedId: nextSelected };
    }
    case "add": {
      const nextItems = [...state.items, action.item];
      return {
        items: nextItems,
        selectedId: state.selectedId ?? action.item.id,
      };
    }
    case "replace": {
      return {
        items: action.items,
        selectedId: action.items.length ? action.items[0].id : null,
      };
    }
    default:
      return state;
  }
}

// 설정 패널
function SetupPanel({
  selectedTitle,
  onRegister,
}: {
  selectedTitle?: string;
  onRegister: () => void;
}) {
  return (
    <L.Bottom $setup>
      <p>{selectedTitle ?? "선택한 동네"}</p>
      <L.Warn>
        <img src={WarnIcon} alt="경고" />
        <p>지도의 표시와 실제 주소가 맞는지 확인해주세요.</p>
      </L.Warn>
      <MainButton title="등록" onClick={onRegister} />
    </L.Bottom>
  );
}

// 리스트 패널
function ListPanel({
  items,
  selectedId,
  onSelect,
  onRemove,
  onAdd,
}: {
  items: MyLocationItem[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onAdd: () => void;
}) {
  return (
    <L.Bottom>
      <p>내 동네</p>
      <L.ButtonGroup>
        {items.map((loc) => (
          <LocationList
            key={loc.id}
            id={loc.id}
            title={loc.title}
            selected={selectedId === loc.id}
            onClick={() => onSelect(loc.id)}
            onRemove={onRemove}
          />
        ))}
        <L.AddButton onClick={onAdd}>
          <img src={PlusIcon} alt="추가" />
          <p>동네 추가하기</p>
        </L.AddButton>
      </L.ButtonGroup>
    </L.Bottom>
  );
}

// 메인
export default function LocationPage() {
  const navigate = useNavigate();
  const {
    isFromSearch,
    setup: setupFromQuery,
    selectedTitleFromQuery,
    sigCodeFromQuery,
    districtIdFromQuery,
  } = useQueryLocationState();

  const [isSetupMode, setIsSetupMode] = useState<boolean>(setupFromQuery);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(
    selectedTitleFromQuery
  );
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER); // 포커스
  const [defaultUserDistrictId, setDefaultUserDistrictId] = useState<
    string | number | null
  >(null); // 디폴트 자치구

  // 내 동네 목록
  const initialItems = useMemo<MyLocationItem[]>(() => [], []);
  const [state, dispatch] = useReducer(reducer, {
    items: initialItems,
    selectedId: initialItems.length ? initialItems[0].id : null,
  } as State);

  // Kakao SDK
  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ["services"],
  });

  // 포커스 위치
  const { pos: myLocation, error: geoError } = useGeoPosition();
  useEffect(() => {
    if (geoError) alert(geoError);
  }, [geoError]);

  useEffect(() => {
    const isLocationSelected = setupFromQuery || state.selectedId !== null;

    if (
      (myLocation.lat !== DEFAULT_CENTER.lat ||
        myLocation.lng !== DEFAULT_CENTER.lng) &&
      !isLocationSelected
    ) {
      setMapCenter(myLocation);
    }
  }, [myLocation, setupFromQuery, state.selectedId]);

  // 시군구 GeoJSON 로드
  const [features, setFeatures] = useState<GeoJSONFeature[] | null>(null);
  useEffect(() => {
    fetch("/sig.json")
      .then((r: Response) => r.json())
      .then((json: unknown) => {
        const g = json as GeoJSON;
        setFeatures(g.features);
      })
      .catch((e: unknown) => console.error("sig.json 로드 실패:", e));
  }, []);

  useEffect(() => {
    setIsSetupMode(setupFromQuery);
    setSelectedTitle(selectedTitleFromQuery);
  }, [setupFromQuery, selectedTitleFromQuery]);

  // 폴리곤 path
  const [sigPaths, setSigPaths] = useState<LatLng[][]>([]);
  useEffect(() => {
    let codeToDisplay: string | undefined = undefined;

    if (isSetupMode) {
      codeToDisplay = sigCodeFromQuery;
    } else {
      const selectedItem = state.items.find(
        (item) => item.id === state.selectedId
      );
      codeToDisplay = selectedItem?.sigCode;
    }

    if (!features || !codeToDisplay) {
      setSigPaths([]);
      return;
    }

    const f: GeoJSONFeature | undefined = features.find(
      (ft) => ft.properties.SIG_CD === codeToDisplay
    );

    if (!f) {
      setSigPaths([]);
      return;
    }
    setSigPaths(toLatLngPaths(f.geometry));
  }, [features, state.selectedId, state.items, isSetupMode, sigCodeFromQuery]);

  const [map, setMap] = useState<unknown>(null);
  useEffect(() => {
    if (!map || sigPaths.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    sigPaths.forEach((ring) =>
      ring.forEach(({ lat, lng }) =>
        bounds.extend(new window.kakao.maps.LatLng(lat, lng))
      )
    );

    (map as { setBounds: (b: unknown) => void }).setBounds(bounds);

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const centerLat = (sw.getLat() + ne.getLat()) / 2;
    const centerLng = (sw.getLng() + ne.getLng()) / 2;

    setMapCenter({ lat: centerLat, lng: centerLng });
  }, [map, sigPaths]);

  // 내 자치구 API
  const fetchDistricts = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/api/v1/users/my/districts");

      // 서버 응답 -> 화면용 아이템
      const items: MyLocationItem[] = data.data.map((ud: UserDistrict) => {
        const r = ud.response;
        const title = [r.sido, r.sigugn, r.eupmyeondong ?? undefined]
          .filter(Boolean)
          .join(" ");
        return {
          id: ud.userDistrictId,
          title,
          sigCode: r.districtId.slice(0, 5),
        };
      });

      const def =
        data.data.find((x: UserDistrict) => x.isDefault)?.userDistrictId ??
        null;
      setDefaultUserDistrictId(def); // 디폴트 설정

      // 디폴트가 맨 위
      const defaultId = data.data.find(
        (x: UserDistrict) => x.isDefault
      )?.userDistrictId;
      const ordered = [...items].sort((a, b) => {
        const aIsDef = a.id === defaultId ? 0 : 1;
        const bIsDef = b.id === defaultId ? 0 : 1;
        return aIsDef - bIsDef;
      });

      // 리스트 교체
      dispatch({ type: "replace", items: ordered });
    } catch (e) {
      console.error("내 자치구 불러오기 실패:", e);
    }
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  // 삭제 확인
  const handleDelete = useCallback(
    async (userDistrictId: number | string) => {
      try {
        await apiClient.delete(`/api/v1/users/districts/${userDistrictId}`);
        await fetchDistricts();
      } catch (e) {
        console.error("자치구 삭제 실패:", e);
      }
    },
    [fetchDistricts]
  );

  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );

  const requestRemove = useCallback((id: string | number) => {
    setDeleteTargetId(id);
  }, []);

  const confirmRemove = useCallback(() => {
    if (deleteTargetId != null) {
      handleDelete(deleteTargetId);
    }
    setDeleteTargetId(null);
  }, [deleteTargetId, handleDelete]);

  const cancelRemove = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const deleteTarget = useMemo<MyLocationItem | undefined>(
    () => state.items.find((i) => i.id === deleteTargetId),
    [state.items, deleteTargetId]
  );

  // Handlers
  const handleSelectLocation = useCallback(
    async (id: string | number) => {
      if (isSetupMode) return;

      // 이미 디폴트면 API 불필요
      if (id === defaultUserDistrictId) {
        if (state.selectedId !== id) dispatch({ type: "select", id });
        return;
      }
      dispatch({ type: "select", id });

      try {
        await apiClient.patch(
          `/api/v1/users/districts/${id}`,
          {},
          { withCredentials: true }
        );
        // 서버 갱신
        await fetchDistricts();
      } catch (e) {
        console.error("기본 자치구 변경 실패:", e);
      }
    },
    [isSetupMode, defaultUserDistrictId, state.selectedId, fetchDistricts]
  );

  const handleAddLocation = useCallback(
    () => navigate("/location/search"),
    [navigate]
  );
  const handleRegister = useCallback(async () => {
    const districtId = districtIdFromQuery;

    if (!selectedTitle || !districtId) {
      return;
    }

    try {
      await apiClient.post(`/api/v1/users/districts/${districtId}`, {});

      await fetchDistricts();

      // 자치구 설정 알림

      setIsSetupMode(false);
      setSelectedTitle(undefined);

      if (isFromSearch) navigate(".", { replace: true, state: null });
    } catch (e) {
      console.error("자치구 업데이트 실패:", e);
    }
  }, [
    isFromSearch,
    navigate,
    selectedTitle,
    districtIdFromQuery,
    fetchDistricts,
  ]);

  if (loading) {
    return (
      <L.Page>
        <Header title={"내 동네 설정"} />
        <div style={{ padding: "20px" }}>지도 로딩중...</div>
      </L.Page>
    );
  }

  return (
    <L.Page>
      <Header
        title={"내 동네 설정"}
        onBack={() => console.log("뒤로가기")}
        rightButton={
          <button onClick={() => setShowInfo((v) => !v)}>
            <img src={InfoIcon} alt="정보" />
          </button>
        }
      />

      <Map
        center={mapCenter}
        level={7}
        style={{ width: "100%", height: isSetupMode ? "70%" : "50%" }}
        onCreate={setMap}
      >
        <MapMarker position={myLocation} />
        {sigPaths.length > 0 && (
          <Polygon
            path={sigPaths}
            strokeWeight={2}
            strokeColor="#FA7577"
            strokeOpacity={1}
            strokeStyle="solid"
            fillColor="#FA7577"
            fillOpacity={0.2}
          />
        )}
      </Map>

      {isSetupMode ? (
        <SetupPanel selectedTitle={selectedTitle} onRegister={handleRegister} />
      ) : (
        <ListPanel
          items={state.items}
          selectedId={state.selectedId}
          onSelect={handleSelectLocation}
          onRemove={requestRemove}
          onAdd={handleAddLocation}
        />
      )}

      {/* 삭제 확인 모달 */}
      <LocationModal
        title={`'${deleteTarget?.title ?? "이 동네"}'\n삭제할까요?`}
        confirmText="삭제"
        isOpen={!!deleteTargetId}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
      />

      {showInfo && (
        <L.Info>
          <h1>지역을 설정하는 이유가 무엇인가요?</h1>
          <p>
            분리수거 날짜와 기준이 지역마다 달라요. 설정한 동네에 맞추어 더욱
            정확한 분리수거 가이드를 제공해드릴게요!
          </p>
        </L.Info>
      )}
    </L.Page>
  );
}
