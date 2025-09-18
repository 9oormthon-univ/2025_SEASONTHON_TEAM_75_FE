import * as L from "./LocationStyle";
import { Map, MapMarker, Polygon, useKakaoLoader } from "react-kakao-maps-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@components/Header";
import LocationDeleteModal from "@components/location/LocationDeleteModal";
import LocationSupportModal from "@components/location/LocationSupportModal";
import InfoIcon from "@assets/info.svg";
import MarkIconUrl from "@assets/map_marker.svg?url";
import MainButton from "@components/MainButton";
import apiClient from "@utils/apiClient";
import { useDistrictActions, useDistricts } from "@stores/userDistrictStore";
import type {
  Location,
  MyLocationItem,
  LatLng,
  GeoJSONFeature,
  KakaoMap,
} from "@types";
import { toLatLngPaths } from "@utils/location/districtService";
import SetupPanel from "@components/location/SetupPanel";
import ListPanel from "@components/location/ListPanel";
import { useMyLocationList } from "@utils/location/useMyLocationList";
import { useSigFeatures } from "@utils/location/useSigFeatures";
import { useQueryLocationState } from "@utils/location/useQueryLocationState";
import { useGeoPosition } from "@utils/location/useGeoPosition";
import { useToast } from "@utils/location/useToast";

// 메인
export default function LocationPage() {
  // Hooks
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  // Store
  const { fetchDistricts, setDistrict, removeDistrict } = useDistrictActions();
  const districts = useDistricts();

  // 커스텀 훅
  const {
    isFromSearch,
    setup: setupFromQuery,
    selectedTitleFromQuery,
    sigCodeFromQuery,
    districtIdFromQuery,
  } = useQueryLocationState();
  const { pos: myLocation, error: geoError, DEFAULT_CENTER } = useGeoPosition();
  const {
    items: myLocations,
    selectedId,
    actions: myLocationActions,
  } = useMyLocationList();
  const { toastTitle, pushToast } = useToast();
  const { features } = useSigFeatures();

  // Kakao SDK
  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ["services"],
  });

  // State
  const [isSetupMode, setIsSetupMode] = useState<boolean>(setupFromQuery);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(
    selectedTitleFromQuery
  );
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [sigPaths, setSigPaths] = useState<LatLng[][]>([]);
  const [map, setMap] = useState<KakaoMap | null>(null);

  // Modal & Info State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [defaultUserDistrictId, setDefaultUserDistrictId] = useState<
    string | number | null
  >(null);

  const from = navState?.from;
  const toastRef = useRef(false);

  // Effects
  // store districts - myLocations 동기화
  useEffect(() => {
    const items: MyLocationItem[] = districts.map((ud) => {
      const r = ud.response;
      const title = [r.sido, r.sigugn, r.eupmyeondong]
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
    myLocationActions.replace(items);
    if (def != null) {
      myLocationActions.select(def);
    }
  }, [districts, myLocationActions]);

  // 초기 districts
  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  // 위치 에러
  useEffect(() => {
    if (geoError) alert(geoError);
  }, [geoError]);

  // 초기 맵 센터
  useEffect(() => {
    if (
      (myLocation.lat !== DEFAULT_CENTER.lat ||
        myLocation.lng !== DEFAULT_CENTER.lng) &&
      !setupFromQuery &&
      selectedId === null
    ) {
      setMapCenter(myLocation);
    }
  }, [myLocation, setupFromQuery, selectedId, DEFAULT_CENTER]);

  // SIG 경계 path 계산
  useEffect(() => {
    let codeToDisplay: string | undefined;
    if (isSetupMode) {
      codeToDisplay = sigCodeFromQuery;
    } else {
      codeToDisplay = myLocations.find(
        (item) => item.id === selectedId
      )?.sigCode;
    }

    if (!features || !codeToDisplay) {
      setSigPaths([]);
      return;
    }

    const feature = features.find(
      (f: GeoJSONFeature) => f.properties.SIG_CD === codeToDisplay
    );
    setSigPaths(feature ? toLatLngPaths(feature.geometry) : []);
  }, [features, selectedId, myLocations, isSetupMode, sigCodeFromQuery]);

  // bounds 맞추기
  useEffect(() => {
    if (!map || sigPaths.length === 0) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    sigPaths.forEach((ring) =>
      ring.forEach(({ lat, lng }) =>
        bounds.extend(new window.kakao.maps.LatLng(lat, lng))
      )
    );
    map.setBounds(bounds);
  }, [map, sigPaths]);

  // 쿼리 state - 로컬 반영
  useEffect(() => {
    setIsSetupMode(setupFromQuery);
    setSelectedTitle(selectedTitleFromQuery);
  }, [setupFromQuery, selectedTitleFromQuery]);

  // 토스트
  useEffect(() => {
    if (
      isFromSearch &&
      !isSetupMode &&
      selectedTitleFromQuery &&
      !toastRef.current
    ) {
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

  // Handlers
  const handleSelectLocation = useCallback(
    async (id: string | number) => {
      if (isSetupMode || id === defaultUserDistrictId) {
        if (selectedId !== id) myLocationActions.select(id);
        return;
      }

      myLocationActions.select(id);
      try {
        await apiClient.patch(`/api/v1/users/districts/${id}`, {});
        const nextTitle = myLocations.find((it) => it.id === id)?.title;
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
      myLocations,
      selectedId,
      pushToast,
      myLocationActions,
    ]
  );

  const handleRegister = useCallback(async () => {
    if (!selectedTitle || !districtIdFromQuery) return;
    const parts = selectedTitle.split(" ").filter(Boolean);
    const loc: Location = {
      districtId: districtIdFromQuery,
      sido: parts[0] ?? "",
      sigugn: parts[1] ?? "",
      eupmyeondong: parts[2] ?? "",
    };

    try {
      const result = await setDistrict(loc);
      const exitToDefault = () => {
        setIsSetupMode(false);
        setSelectedTitle(undefined);
        if (isFromSearch) navigate(".", { replace: true, state: { from } });
      };

      if (result.ok) {
        pushToast(`내 동네를 '${result.label}'으로 설정했어요`);
        exitToDefault();
      } else {
        toastRef.current = true;
        exitToDefault();
        if (result.error === "UNSUPPORTED_REGION") setShowSupportModal(true);
        else alert("자치구 등록 실패");
      }
    } catch (e) {
      console.error("자치구 등록 처리 실패:", e);
    }
  }, [
    districtIdFromQuery,
    selectedTitle,
    setDistrict,
    pushToast,
    isFromSearch,
    navigate,
    from,
  ]);

  const confirmRemove = useCallback(async () => {
    if (deleteTargetId === null) return;
    try {
      await removeDistrict(deleteTargetId);
      const title = myLocations.find((i) => i.id === deleteTargetId)?.title;
      if (title) pushToast(`내 동네 '${title}'을 삭제했어요`);
    } catch (e) {
      console.error("자치구 삭제 실패:", e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, removeDistrict, myLocations, pushToast]);

  const deleteTarget = useMemo(
    () => myLocations.find((i) => i.id === deleteTargetId),
    [myLocations, deleteTargetId]
  );

  if (loading)
    return (
      <L.Loading>
        <Header title={"내 동네 설정"} />
        <div>지도 로딩중...</div>
      </L.Loading>
    );

  // Render
  return (
    <L.Page>
      <Header
        title="내 동네 설정"
        isBackButton={from === "home"}
        isCloseButton={from === "home"}
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
        <MapMarker
          position={myLocation}
          image={{ src: MarkIconUrl, size: { width: 23, height: 23 } }}
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
          items={myLocations}
          selectedId={selectedId}
          onSelect={handleSelectLocation}
          onRemove={(id) => setDeleteTargetId(Number(id))}
          onAdd={() => navigate("/location/search", { state: { from } })}
        />
      )}

      <LocationDeleteModal
        district={`${deleteTarget?.title}`}
        isOpen={!!deleteTargetId}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={confirmRemove}
      />
      <LocationSupportModal
        isOpen={showSupportModal}
        onConfirm={() => setShowSupportModal(false)}
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
          />
        </L.Complete>
      )}
    </L.Page>
  );
}
