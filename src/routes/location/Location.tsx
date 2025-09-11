import * as L from "./LocationStyle";
import { Map, MapMarker, Polygon, useKakaoLoader } from "react-kakao-maps-sdk";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@components/Header";
import LocationDeleteModal from "@components/location/LocationDeleteModal";
import InfoIcon from "@assets/info.svg";
import PlusIcon from "@assets/plus.svg";
import WarnIcon from "@assets/warning.svg";
import MarkIconUrl from "@assets/map_marker.svg?url";
import LocationList from "@components/location/LocationList";
import MainButton from "@components/MainButton";
import apiClient from "@utils/apiClient";
import { useDistrictActions, useDistricts } from "@stores/userDistrictStore";
import type { Location, GeocoderLike } from "@types";

// 상수
const DEFAULT_CENTER: LatLng = { lat: 37.525121, lng: 126.96339 };

// 타입
type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
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
  from?: "home" | "profile_complete";
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
  onRemove: (id: number) => void;
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
        {items.length < 2 && (
          <L.AddButton onClick={onAdd}>
            <img src={PlusIcon} alt="추가" />
            <p>동네 추가하기</p>
          </L.AddButton>
        )}
      </L.ButtonGroup>
    </L.Bottom>
  );
}

// 메인
export default function LocationPage() {
  const { fetchDistricts, setDistrict, removeDistrict } = useDistrictActions();
  const districts = useDistricts();

  const navigate = useNavigate();
  const { state: navState } = useLocation() as { state: LocationState };
  const from = navState?.from;
  // 들어온 경로에 따라 헤더 수정
  const isBackButton = from === "home";
  const rightButton = (
    <button onClick={() => setShowInfo((v) => !v)}>
      <img src={InfoIcon} alt="정보" />
    </button>
  );

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

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null); // 삭제
  const [defaultUserDistrictId, setDefaultUserDistrictId] = useState<
    string | number | null
  >(null); // 디폴트 자치구

  // 토스트 메시지
  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const pushToast = useCallback((title: string) => {
    setToastTitle(`${title}`);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastTitle(null);
      toastTimerRef.current = null;
    }, 2000);
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFromSearch && !isSetupMode && selectedTitleFromQuery) {
      pushToast(`내 동네를 '${selectedTitleFromQuery}'으로 설정했어요`);
      navigate(".", { replace: true, state: { from } });
    }
  }, [
    isFromSearch,
    isSetupMode,
    selectedTitleFromQuery,
    pushToast,
    navigate,
    from,
  ]);

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
  const fetchStore = useCallback(async () => {
    // 서버 응답 -> 화면용 아이템
    const items: MyLocationItem[] = districts.map((ud) => {
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

    const def = districts.find((x) => x.isDefault)?.userDistrictId ?? null;

    setDefaultUserDistrictId(def);

    // 리스트 교체
    dispatch({ type: "replace", items: items });

    if (def != null) {
      dispatch({ type: "select", id: def });
    }
  }, [districts]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  // 삭제 확인
  const handleDelete = useCallback(
    async (userDistrictId: number | string, title?: string) => {
      try {
        await removeDistrict(Number(userDistrictId));

        if (title) {
          pushToast(`내 동네 '${title}'을 삭제했어요`);
        }
      } catch (e) {
        console.error("자치구 삭제 실패:", e);
      }
    },
    [removeDistrict, pushToast]
  );

  const confirmRemove = useCallback(() => {
    if (deleteTargetId != null) {
      const title = state.items.find((i) => i.id === deleteTargetId)?.title;
      handleDelete(deleteTargetId, title);
    }
    setDeleteTargetId(null);
  }, [deleteTargetId, handleDelete, state.items]);

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

      const nextTitle = state.items.find((it) => it.id === id)?.title;

      dispatch({ type: "select", id });

      try {
        await apiClient.patch(`/api/v1/users/districts/${id}`, {});

        if (nextTitle) {
          pushToast(`내 동네를 '${nextTitle}'으로 설정했어요`);
        }

        setDefaultUserDistrictId(id);
      } catch (e) {
        console.error("기본 자치구 변경 실패:", e);
      }
    },
    [
      isSetupMode,
      defaultUserDistrictId,
      state.items,
      state.selectedId,
      pushToast,
    ]
  );

  const handleAddLocation = useCallback(
    () => navigate("/location/search", { state: { from } }),
    [navigate, from]
  );

  const handleRegister = useCallback(async () => {
    const districtId = districtIdFromQuery;
    if (!selectedTitle || !districtId) return;

    const parts = selectedTitle.split(" ").filter(Boolean);
    const [sido, sigugn, eupmyeondong] = [
      parts[0] ?? "",
      parts[1] ?? "",
      parts[2] ?? "",
    ];

    const loc: Location = {
      districtId, // 10자리
      sido,
      sigugn,
      eupmyeondong,
    };

    const result = await setDistrict(loc);
    if (!result) {
      console.error("자치구 등록 실패");
      return;
    }

    await fetchDistricts();

    pushToast(`내 동네를 '${result.label}'으로 설정했어요`);

    setIsSetupMode(false);
    setSelectedTitle(undefined);

    if (isFromSearch) {
      navigate(".", { replace: true, state: { from } });
    }
  }, [
    districtIdFromQuery,
    selectedTitle,
    setDistrict,
    fetchDistricts,
    pushToast,
    isFromSearch,
    navigate,
    from,
  ]);

  if (loading) {
    return (
      <L.Loading>
        <Header title={"내 동네 설정"} />
        <div>지도 로딩중...</div>
      </L.Loading>
    );
  }

  return (
    <L.Page>
      <Header
        title="내 동네 설정"
        isBackButton={isBackButton}
        rightButton={rightButton}
      />

      <Map
        center={mapCenter}
        level={7}
        style={{ width: "100%", height: isSetupMode ? "70%" : "50%" }}
        onCreate={setMap}
      >
        <MapMarker
          position={myLocation}
          image={{
            src: MarkIconUrl,
            size: { width: 23, height: 23 },
          }}
        />
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

      {toastTitle && <L.Toast>{toastTitle}</L.Toast>}

      {isSetupMode ? (
        <SetupPanel selectedTitle={selectedTitle} onRegister={handleRegister} />
      ) : (
        <ListPanel
          items={state.items}
          selectedId={state.selectedId}
          onSelect={handleSelectLocation}
          onRemove={(id: number) => {
            setDeleteTargetId(id);
          }}
          onAdd={handleAddLocation}
        />
      )}

      {/* 삭제 확인 모달 */}
      <LocationDeleteModal
        district={`${deleteTarget?.title}`}
        isOpen={!!deleteTargetId}
        onCancel={() => {
          setDeleteTargetId(null);
        }}
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

      {!isSetupMode && from !== "home" && (
        <L.Complete>
          <MainButton
            title="동네 설정 완료"
            onClick={() => navigate("/home")}
            disabled={state.items.length === 0}
          />
        </L.Complete>
      )}
    </L.Page>
  );
}
