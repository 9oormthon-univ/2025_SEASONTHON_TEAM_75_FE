import * as H from "@routes/home/HomeStyle";
import SectionHeader from "@components/home/SectionHeader";
import locationIcon from "@assets/location.svg";
import dropdownIcon from "@assets/dropdown.svg";
import RankingItem from "@components/home/RankingItem";
import TrashCard from "@components/home/TrashCard";
import { useState, useEffect, Fragment } from "react";
import TrashCardModal from "@components/home/TrashCardModal";
import DefaultIcon from "@assets/main_default.svg";
import EarthIcon from "@assets/main_earth.svg";
import FoodIcon from "@assets/main_food.svg";
import PetIcon from "@assets/main_pet.svg";
import CalIcon from "@assets/main_cal.svg";
import LocationSelectModal from "@components/home/LocationSelectModal";
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

interface Location {
  districtId: string;
  sido: string;
  sigugn: string;
  eupmyeondong: string;
}

interface UserDistrict {
  response: Location;
  userDistrictId: number;
  isDefault: boolean;
}

interface TrashSchedule {
  categoryName: string;
  trashTypes: string[];
  location: string;
  todayDay: string;
  todayDate: string;
}

interface ScheduleInfo {
  categories: string[];
  location: string;
  date: string;
}

interface ApiRankingItem {
  rankId: number;
  trashImageUrl: string | null;
  trashTypeName: string;
  rankOrder: number;
  totalSearchCount: number;
  trendDirection: "UP" | "DOWN" | "SAME";
}

interface RankingApiResponse {
  data: {
    rankings: ApiRankingItem[];
    lastUpdated: string;
  };
}

interface RankingItemData {
  rank: number;
  imageUrl: string;
  name: string;
  trendDirection: "UP" | "DOWN" | "SAME";
  searchCount: number;
}

interface ApiRevisionItem {
  revisionId: number;
  subTitle: string;
  trashTypeName: string;
  revisionDate: string;
}

interface ApiRevisionDetail {
  revisionId: number;
  subTitle: string;
  title: string;
  content: string;
  revisionDate: string;
  trashTypeName: string;
}

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
  const [myDistricts, setMyDistricts] = useState<UserDistrict[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<Location | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [rankingList, setRankingList] = useState<RankingItemData[]>([]);
  const [rankingLastUpdated, setRankingLastUpdated] = useState<string>("");
  const formattedDate = scheduleInfo?.date
    ? scheduleInfo.date.substring(5).replace("-", ".")
    : "";
  const [revisionList, setRevisionList] = useState<ApiRevisionItem[]>([]);
  const [selectedRevision, setSelectedRevision] =
    useState<ApiRevisionDetail | null>(null);
  const [isRevisionModalOpen, setRevisionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyDistricts = async () => {
    try {
      const response = await apiClient.get<{ data: UserDistrict[] }>(
        "/api/v1/users/my/districts"
      );
      const districts = response.data.data;
      const currentDefault =
        districts.find((d) => d.isDefault)?.response || null;

      setMyDistricts(districts);
      setDefaultLocation(currentDefault);
    } catch (error) {
      console.error("자치구 목록 조회에 실패했습니다.", error);
    }
  };

  const fetchTrashSchedule = async () => {
    try {
      const response = await apiClient.get<{ data: TrashSchedule[] }>(
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
      const response = await apiClient.get<RankingApiResponse>(
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
    if (myDistricts.length === 0) {
      navigate("/location");
    } else {
      setModalOpen(true);
    }
  };

  const handleDefaultChange = () => {
    fetchMyDistricts();
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
      try {
        await Promise.all([
          fetchMyDistricts(),
          fetchRankings(),
          fetchRevisions(),
        ]);
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

  const renderMainContent = () => {
    const { categories, location } = scheduleInfo!;
    const GENERAL_WASTE = "일반/음식물쓰레기";
    const PET_WASTE = "투명페트병/비닐";
    const OTHER_RECYCLABLES = "그외 재활용품";

    const sortOrder = [GENERAL_WASTE, PET_WASTE, OTHER_RECYCLABLES];

    const sortedCategories = [...categories].sort((a, b) => {
      const indexA = sortOrder.indexOf(a);
      const indexB = sortOrder.indexOf(b);
      return indexA - indexB;
    });

    if (categories.length === 0) {
      return {
        icon: EarthIcon,
        title: (
          <H.Titles>
            <H.TitleTop>
              <H.Highlight1>오늘은</H.Highlight1>
            </H.TitleTop>
            <H.TitleBottom>
              <H.Highlight2>분리수거 없는 날</H.Highlight2>
            </H.TitleBottom>
            <H.SubTitle>오늘은 버리지 말고 차곡차곡 모아둬요!</H.SubTitle>
          </H.Titles>
        ),
      };
    }

    const isAllTrashDay =
      categories.includes(GENERAL_WASTE) &&
      categories.includes(PET_WASTE) &&
      categories.includes(OTHER_RECYCLABLES);

    if (isAllTrashDay) {
      return {
        icon: DefaultIcon,
        title: (
          <H.Titles>
            <H.TitleTop>
              오늘은 <H.Highlight1>{location}</H.Highlight1>
            </H.TitleTop>
            <H.TitleBottom>
              <H.Highlight2>모든 쓰레기</H.Highlight2> 버리는 날
            </H.TitleBottom>
            <H.SubTitle>오늘도 한 봉지 깔끔하게 비워볼까요?</H.SubTitle>
          </H.Titles>
        ),
      };
    }

    let icon = DefaultIcon;
    if (categories.includes(GENERAL_WASTE)) {
      icon = FoodIcon;
    } else if (categories.includes(PET_WASTE)) {
      icon = PetIcon;
    }

    const title = (
      <H.Titles>
        <H.TitleTop>
          오늘은 <H.Highlight1>{location}</H.Highlight1>
        </H.TitleTop>
        <H.TitleBottom>
          <H.Highlight2>
            {sortedCategories.map((cat, index) => (
              <Fragment key={index}>
                {cat}
                {index < categories.length - 1 && <>,</>}
                {index < categories.length - 1 && <br />}
              </Fragment>
            ))}
          </H.Highlight2>{" "}
          버리는 날
        </H.TitleBottom>
        <H.SubTitle>오늘도 한 봉지 깔끔하게 비워볼까요?</H.SubTitle>
      </H.Titles>
    );

    return { icon, title };
  };

  const getContent = () => {
    if (!defaultLocation || !scheduleInfo) {
      return {
        icon: CalIcon,
        title: (
          <H.Titles>
            <H.TitleTop>현재 설정된</H.TitleTop>
            <H.TitleBottom>
              <H.Highlight1>동네가 없어요</H.Highlight1>
            </H.TitleBottom>
            <H.SubTitle>동네를 설정하면 분리수거 날짜를 알려드려요!</H.SubTitle>
          </H.Titles>
        ),
      };
    }
    return renderMainContent();
  };

  const { icon: mainIcon, title: mainTitle } = getContent();

  const formattedLastUpdated = formatRelativeTime(rankingLastUpdated);

  return (
    <H.HomeContainer>
      <H.HomeHeader>
        <H.Logo src={LogoIcon} alt="로고"></H.Logo>
        <H.LocationBox
          onClick={handleLocationClick}
          style={{ cursor: "pointer" }}
        >
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
        <H.MainSection>
          <H.Today>{formattedDate}</H.Today>
          {mainTitle}
          <H.MainIcon>
            <img src={mainIcon} alt="메인 아이콘" />
          </H.MainIcon>
        </H.MainSection>
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
        districts={myDistricts}
        onDefaultChange={handleDefaultChange}
      />
    </H.HomeContainer>
  );
};
export default Home;
