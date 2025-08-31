import * as H from "@routes/home/HomeStyle";
import SectionHeader from "@components/home/SectionHeader";
import logo from "@assets/logo.svg";
import locationIcon from "@assets/location.svg";
import dropdownIcon from "@assets/dropdown.svg";
import RankingItem from "@components/home/RankingItem";
import RankingImg from "@assets/rankingImg.svg";
import TrashCard from "@components/home/TrashCard";
import TrashClothImg from "@assets/cloth.svg";
import TrashPaperImg from "@assets/paper.svg";
import { useState } from "react";
import TrashCardModal from "@components/home/TrashCardModal";

const rankingData = [
  {
    rank: 1,
    imageUrl: RankingImg,
    name: "플라스틱 병",
    searchCount: 1234,
    changePercentage: 15,
  },
  {
    rank: 2,
    imageUrl: RankingImg,
    name: "알루미늄 캔",
    searchCount: 1234,
    changePercentage: 15,
  },
  {
    rank: 3,
    imageUrl: RankingImg,
    name: "알루미늄 캔",
    searchCount: 1234,
    changePercentage: 15,
  },
];

interface TrashCardData {
  id: number;
  imageUrl: string;
  type: string;
  description: string;
  date: Date;
}

const trashCardData = [
  {
    id: 1,
    imageUrl: TrashClothImg,
    type: "의류·섬유류",
    description: "헌 옷 수거함",
    date: new Date("2025-01-01"),
  },
  {
    id: 2,
    imageUrl: TrashPaperImg,
    type: "종이팩",
    description: "종이류와 별도 배출",
    date: new Date("2025-03-01"),
  },
];

const modalContentMap: { [key: string]: { title: string; content: string } } = {
  의류·섬유류: {
    title: "의류 및 섬유 제품 분리수거 의무화",
    content:
      "2025년 1월부터 의류 및 섬유 제품을 일반 쓰레기통에 버리는 것이 금지됩니다. 모든 의류와 섬유 제품(헌 옷, 침구류, 커튼, 수건 등)은 헌 옷 수거함(Altkleidercontainer)에 별도로 배출해야 합니다.\n의류 및 섬유 제품 분리배출 방법:\n1. 깨끗하게 세탁한 후 배출해 주세요\n2. 젖지 않도록 건조한 상태로 배출해 주세요\n3. 가능한 비닐봉투에 담아 헌 옷 수거함에 넣어주세요",
  },
  종이팩: {
    title: "종이팩 분리수거 방법 변경",
    content:
      "2025년 3월부터는 종이팩을 일반 종이류와 함께 배출하는 것이 금지됩니다. 종이팩은 별도의 수거 장소에 배출해야 하며, 이 규정을 지키지 않을 경우 과태료가 부과될 수 있습니다.\n종이팩 분리배출 올바른 방법:\n1. 내용물을 비우고 물로 헹궈주세요\n2. 접어서 말린 후 별도 수거함에 배출해 주세요\n3. 종이류와 함께 배출하지 마세요",
  },
};

const Home = () => {
  const location = "강남구";
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${month}.${day}`;

  const [selectedCard, setSelectedCard] = useState<TrashCardData | null>(null);

  const handleOpenModal = (card: TrashCardData) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <H.HomeContainer>
      <H.HomeHeader>
        <H.Logo src={logo} alt="로고"></H.Logo>
        <H.LocationBox>
          <H.LocationIcon src={locationIcon} alt="위치 아이콘"></H.LocationIcon>
          <H.LocationName>{location}</H.LocationName>
          <H.LocationDropdown
            src={dropdownIcon}
            alt="드롭다운 아이콘"
          ></H.LocationDropdown>
        </H.LocationBox>
      </H.HomeHeader>
      <SectionHeader title="오늘의 분리수거"></SectionHeader>
      <H.MainSection>
        <H.Today>{formattedDate}</H.Today>
        <H.Titles>
          <H.TitleTop>
            오늘은 <H.Highlight1>{location}</H.Highlight1>
          </H.TitleTop>
          <H.TitleBottom>
            <H.Highlight2>투명페트병/비닐</H.Highlight2> 버리는 날
          </H.TitleBottom>
          <H.SubTitle>오늘도 한 봉지 깔끔하게 비워볼까요?</H.SubTitle>
        </H.Titles>
      </H.MainSection>
      <H.BgBox>
        <SectionHeader
          title="금주의 쓰레기 인기랭킹"
          subtitle="월요일 업데이트"
        ></SectionHeader>
        <H.RankingWrapper>
          {rankingData.map((item) => (
            <RankingItem
              key={item.rank}
              rank={item.rank}
              imageUrl={item.imageUrl}
              name={item.name}
              searchCount={item.searchCount}
              changePercentage={item.changePercentage}
            />
          ))}
        </H.RankingWrapper>
        <SectionHeader
          title="최신 개정 쓰레기"
          subtitle="최신 개정 반영중"
        ></SectionHeader>
        <H.TrashCardList>
          {trashCardData.map((card) => (
            <TrashCard
              key={card.id}
              imageUrl={card.imageUrl}
              type={card.type}
              description={card.description}
              date={card.date}
              onClick={() => handleOpenModal(card)}
            />
          ))}
        </H.TrashCardList>
      </H.BgBox>
      <TrashCardModal
        isOpen={!!selectedCard}
        onClose={handleCloseModal}
        title={selectedCard ? modalContentMap[selectedCard.type]?.title : ""}
        content={
          selectedCard ? modalContentMap[selectedCard.type]?.content : ""
        }
      />
    </H.HomeContainer>
  );
};
export default Home;
