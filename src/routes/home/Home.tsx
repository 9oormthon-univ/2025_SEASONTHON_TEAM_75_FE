import * as H from "@routes/home/HomeStyle";
import SectionHeader from "@components/home/SectionHeader";
import locationIcon from "@assets/location.svg";
import dropdownIcon from "@assets/dropdown.svg";
import RankingItem from "@components/home/RankingItem";
import TrashCard from "@components/home/TrashCard";
import { useState, useEffect } from "react";
import TrashCardModal from "@components/home/TrashCardModal";
import LocationSelectModal from "@components/home/LocationSelectModal";
import LoginGuideModal from "@components/home/LoginGuideModal";
import apiClient from "@utils/apiClient";
import { useNavigate } from "react-router-dom";
import RankingImg from "@assets/rankingImg.svg";
import { TRASH_TYPES } from "@utils/trashType";
import EtcIcon from "@assets/etc.svg";
import LogoIcon from "@assets/home_logo.svg";
import {
  MainSectionSkeleton,
  RankingItemSkeleton,
  TrashCardSkeleton,
} from "@components/home/Skeleton";
import { useDistricts, useDefaultDistrict } from "@stores/userDistrictStore";
import type {
  ApiTrashSchedule,
  ScheduleInfo,
  RankingApiResponse,
  RankingItemData,
  ApiRevisionItem,
  ApiRevisionDetail,
} from "@types";
import ScheduleCard from "@components/home/ScheduleCard";
import { useDistrictActions } from "@stores/userDistrictStore";
import { useAuthStatus, useAuthActions } from "@stores/authStore";

const getIconForTrashType = (trashTypeName: string): string => {
  const foundType = Object.values(TRASH_TYPES).find(
    (type) => type.nameKo === trashTypeName
  );
  return foundType ? foundType.icon : EtcIcon;
};

const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return "";

  const now = new Date();
  const lastUpdatedDate = new Date(`${dateString}+09:00`);
  const diffInMs = now.getTime() - lastUpdatedDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 0) {
    return `${dateString.substring(0, 10).replace(/-/g, ".")} 기준`;
  }
  if (diffInMinutes < 1) {
    return "방금 전 업데이트";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전 업데이트`;
  }
  if (diffInMinutes < 120) {
    return "1시간 전 업데이트";
  }
  if (diffInMinutes < 180) {
    return "2시간 전 업데이트";
  }
  return `${dateString.substring(0, 10).replace(/-/g, ".")} 기준`;
};

const Home = () => {
  const authStatus = useAuthStatus();
  const { checkAuth } = useAuthActions();
  const myDistricts = useDistricts();
  const { fetchDistricts } = useDistrictActions();
  const defaultLocation = useDefaultDistrict();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginGuideModalOpen, setLoginGuideModalOpen] = useState(false);
  const navigate = useNavigate();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [rankingList, setRankingList] = useState<RankingItemData[]>([]);
  const [rankingLastUpdated, setRankingLastUpdated] = useState<string>("");
  const [revisionList, setRevisionList] = useState<ApiRevisionItem[]>([]);
  const [selectedRevision, setSelectedRevision] =
    useState<ApiRevisionDetail | null>(null);
  const [isRevisionModalOpen, setRevisionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUserFlow = async () => {
      const resolvedStatus = await checkAuth();

      console.log("서버에서 확인된 사용자 상태:", resolvedStatus);

      if (resolvedStatus === "member") {
        fetchDistricts();
      }
    };

    if (authStatus === "loading") {
      initializeUserFlow();
    }
  }, [authStatus, checkAuth, fetchDistricts]);

  const fetchTrashSchedule = async () => {
    try {
      const response = await apiClient.get<{ data: ApiTrashSchedule[] }>(
        `/api/v1/disposals/today`
      );
      const responseData = response.data.data;

      if (responseData && responseData.length > 0) {
        setScheduleInfo({
          categories: responseData.map((item) => item.categoryName),
          location: responseData[0].location,
          date: responseData[0].todayDate,
        });
      } else {
        const today = new Date().toISOString().slice(0, 10);
        setScheduleInfo({
          categories: [],
          location: defaultLocation?.sigugn || "",
          date: today,
        });
      }
    } catch (error) {
      console.error("오늘의 배출 쓰레기 정보 조회에 실패했습니다.", error);
      setScheduleInfo(null);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await apiClient.get<{ data: RankingApiResponse }>(
        "/api/v1/rank/current"
      );

      const rawData = response.data.data.rankings;
      const lastUpdatedDate = response.data.data.lastUpdated;

      const processedData = rawData.map((item) => ({
        rank: item.rankOrder,
        imageUrl: item.trashImageUrl || RankingImg,
        name: item.trashTypeName,
        searchCount: item.totalSearchCount,
        trendDirection: item.trendDirection,
      }));

      setRankingList(processedData);
      setRankingLastUpdated(lastUpdatedDate);
    } catch (error) {
      console.error("랭킹 데이터 조회에 실패했습니다.", error);
    }
  };

  const fetchRevisions = async () => {
    try {
      const response = await apiClient.get<{ data: ApiRevisionItem[] }>(
        "/api/v1/revisions"
      );
      setRevisionList(response.data.data);
    } catch (error) {
      console.error("최신 개정 쓰레기 목록 조회에 실패했습니다.", error);
    }
  };

  const handleLocationClick = () => {
    if (authStatus === "loading") return;

    if (authStatus === "member") {
      if (myDistricts.length === 0) {
        navigate("/location");
      } else {
        setModalOpen(true);
      }
    } else {
      setLoginGuideModalOpen(true);
    }
  };

  const handleOpenRevisionModal = async (revisionId: number) => {
    setRevisionModalOpen(true);
    try {
      const response = await apiClient.get<{ data: ApiRevisionDetail }>(
        `/api/v1/revisions/${revisionId}`
      );
      setSelectedRevision(response.data.data);
    } catch (error) {
      console.error("개정 상세 정보 조회 실패:", error);
      handleCloseRevisionModal();
    }
  };

  const handleCloseRevisionModal = () => {
    setRevisionModalOpen(false);
    setSelectedRevision(null);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchRankings(), fetchRevisions()]);
      } catch (error) {
        console.error("초기 데이터 로딩에 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (defaultLocation) {
      fetchTrashSchedule();
    } else {
      setScheduleInfo(null);
    }
  }, [defaultLocation]);

  const formattedLastUpdated = formatRelativeTime(rankingLastUpdated);

  return (
    <H.HomeContainer>
      <H.HomeHeader>
        <H.Logo src={LogoIcon} alt="로고"></H.Logo>
        <H.LocationBox onClick={handleLocationClick}>
          <H.LocationIcon src={locationIcon} alt="위치 아이콘" />
          <H.LocationName>
            {defaultLocation ? defaultLocation.sigugn : "동네 설정"}
          </H.LocationName>
          <H.LocationDropdown src={dropdownIcon} alt="드롭다운 아이콘" />
        </H.LocationBox>
      </H.HomeHeader>
      {isLoading ? (
        <MainSectionSkeleton />
      ) : (
        <ScheduleCard scheduleInfo={scheduleInfo} />
      )}
      <H.BgBox>
        <SectionHeader
          title="실시간 쓰레기 인기랭킹"
          subtitle={formattedLastUpdated}
        ></SectionHeader>
        <H.RankingWrapper>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <RankingItemSkeleton key={index} />
              ))
            : rankingList.map((item) => (
                <RankingItem
                  key={item.rank}
                  rank={item.rank}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  searchCount={item.searchCount}
                  trendDirection={item.trendDirection}
                />
              ))}
        </H.RankingWrapper>
        <SectionHeader
          title="최신 개정 쓰레기"
          subtitle="최신 개정 반영중"
        ></SectionHeader>
        <H.TrashCardList>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TrashCardSkeleton key={index} />
              ))
            : revisionList.map((card) => (
                <TrashCard
                  key={card.revisionId}
                  imageUrl={getIconForTrashType(card.trashTypeName)}
                  type={card.trashTypeName}
                  description={card.subTitle}
                  date={new Date(card.revisionDate)}
                  onClick={() => handleOpenRevisionModal(card.revisionId)}
                />
              ))}
        </H.TrashCardList>
      </H.BgBox>
      <TrashCardModal
        isOpen={isRevisionModalOpen}
        onClose={handleCloseRevisionModal}
        title={selectedRevision?.title || ""}
        content={selectedRevision?.content || ""}
      />
      <LocationSelectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <LoginGuideModal
        isOpen={isLoginGuideModalOpen}
        onClose={() => setLoginGuideModalOpen(false)}
      />
    </H.HomeContainer>
  );
};
export default Home;
