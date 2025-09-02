import * as L from "./LocationStyle";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@components/Header";
import LocationModal from "@components/location/LocationModal";
import InfoIcon from "@assets/info.svg";
import PlusIcon from "@assets/plus.svg";
import LocationSelectButton from "@components/location/LocationSelectButton";
import LocationList from "@components/location/LocationList";

/* Types */
type LocationState = {
  source?: "location_search";
  setup?: boolean;
  selected?: string;
} | null;

export type MyLocationItem = {
  id: string | number;
  type: "집" | "회사" | "기타";
  title: string;
};

/* Consts */
const MODAL_DISMISSED_KEY = "locationModalDismissed"; // 취소/확인 누른 적 있음
const DEFAULT_CENTER = { lat: 37.525121, lng: 126.96339 };

/* Hooks */
function useQueryLocationState() {
  const { state } = useLocation() as { state: LocationState };
  const isFromSearch = state?.source === "location_search";
  return {
    isFromSearch,
    setup: isFromSearch && !!state?.setup,
    selectedTitleFromQuery: isFromSearch ? state?.selected : undefined,
  } as const;
}

function useGeoPosition() {
  const [pos, setPos] = useState(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }

    const id = navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude, longitude } = p.coords;
        setPos({ lat: latitude, lng: longitude });
      },
      (err) => {
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

/* Location */
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

/* Panels */
function SetupPanel({
  selectedTitle,
  selectedType,
  onChangeType,
  onRegister,
}: {
  selectedTitle?: string;
  selectedType: "집" | "회사" | "기타";
  onChangeType: (t: "집" | "회사" | "기타") => void;
  onRegister: () => void;
}) {
  return (
    <L.Bottom $setup>
      <p>{selectedTitle ?? "선택한 동네"}</p>
      <L.LocationGroup>
        {(["집", "회사", "기타"] as const).map((t) => (
          <LocationSelectButton
            key={t}
            title={t}
            selected={selectedType === t}
            onClick={() => onChangeType(t)}
          />
        ))}
      </L.LocationGroup>
      <L.RegisterButton onClick={onRegister}>등록</L.RegisterButton>
    </L.Bottom>
  );
}

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
            type={loc.type}
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

/* Modal */
function useLocationGuideModal(isSetupMode: boolean) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const dismissed = localStorage.getItem(MODAL_DISMISSED_KEY) === "1";
    const shouldOpen = !dismissed && !isSetupMode; // 기본 모드에서만 열기
    setOpen(shouldOpen);
  }, [isSetupMode]);

  const cancel = () => {
    localStorage.setItem(MODAL_DISMISSED_KEY, "1");
    setOpen(false);
  };
  const confirm = () => {
    localStorage.setItem(MODAL_DISMISSED_KEY, "1");
    setOpen(false);
    console.log("내 위치 등록");
  };
  return { open, cancel, confirm } as const;
}

/* Main */
export default function LocationPage() {
  const navigate = useNavigate();
  const {
    isFromSearch,
    setup: setupFromQuery,
    selectedTitleFromQuery,
  } = useQueryLocationState();

  const [isSetupMode, setIsSetupMode] = useState<boolean>(setupFromQuery);
  const [selectedType, setSelectedType] = useState<"집" | "회사" | "기타">(
    "집"
  );
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(
    selectedTitleFromQuery
  );
  const [showInfo, setShowInfo] = useState(false);

  // Kakao SDK
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
    libraries: ["services"],
  });

  // 위치
  const { pos: myLocation, error: geoError } = useGeoPosition();
  useEffect(() => {
    if (geoError) alert(geoError);
  }, [geoError]);

  // 모달
  const modal = useLocationGuideModal(isSetupMode);

  // 내 동네 목록
  const initialItems = useMemo<MyLocationItem[]>(
    () => [
      { id: 1, type: "기타", title: "서울시 마포구 합정동" },
      { id: 2, type: "집", title: "서울시 용산구 이촌동" },
    ],
    []
  );
  const [state, dispatch] = useReducer(reducer, {
    items: initialItems,
    selectedId: initialItems.length ? initialItems[0].id : null,
  });

  useEffect(() => {
    setIsSetupMode(setupFromQuery);
    setSelectedTitle(selectedTitleFromQuery);
  }, [setupFromQuery, selectedTitleFromQuery]);

  // 삭제 확인
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );
  const requestRemove = useCallback((id: string | number) => {
    setDeleteTargetId(id);
  }, []);
  const confirmRemove = useCallback(() => {
    if (deleteTargetId != null) {
      dispatch({ type: "remove", id: deleteTargetId });
    }
    setDeleteTargetId(null);
  }, [deleteTargetId]);
  const cancelRemove = useCallback(() => {
    setDeleteTargetId(null);
  }, []);
  const deleteTarget = useMemo(
    () => state.items.find((i) => i.id === deleteTargetId),
    [state.items, deleteTargetId]
  );

  // Handlers
  const handleSelectLocation = useCallback(
    (id: string | number) => dispatch({ type: "select", id }),
    []
  );
  const handleAddLocation = useCallback(
    () => navigate("/location_search"),
    [navigate]
  );

  const handleRegister = useCallback(() => {
    // TODO: API 연동
    console.log("동네 등록:", selectedTitle, myLocation, selectedType);

    // 기본 모드 전환 -> URL state 정리
    setIsSetupMode(false);
    setSelectedTitle(undefined);
    if (isFromSearch) navigate(".", { replace: true, state: null });
  }, [selectedTitle, myLocation, selectedType, isFromSearch, navigate]);

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
        center={myLocation}
        level={7}
        style={{ width: "100%", height: "70%" }}
      >
        <MapMarker position={myLocation} />
      </Map>

      {isSetupMode ? (
        <SetupPanel
          selectedTitle={selectedTitle}
          selectedType={selectedType}
          onChangeType={setSelectedType}
          onRegister={handleRegister}
        />
      ) : (
        <ListPanel
          items={state.items}
          selectedId={state.selectedId}
          onSelect={handleSelectLocation}
          onRemove={requestRemove}
          onAdd={handleAddLocation}
        />
      )}

      {/* 위치 안내 모달 */}
      {!isSetupMode && (
        <LocationModal
          title={"현재 내 위치 '마포구'\n등록할까요?"}
          confirmText="확인"
          isOpen={modal.open}
          onCancel={modal.cancel}
          onConfirm={modal.confirm}
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
          <h1>{`지역을 설정하는 이유가 무엇인가요?`}</h1>
          <p>
            {`분리수거 날짜와 기준이 지역마다 달라요. 설정한 동네에 맞추어 더욱
      정확한 분리수거 가이드를 제공해드릴게요!`}
          </p>
        </L.Info>
      )}
    </L.Page>
  );
}
