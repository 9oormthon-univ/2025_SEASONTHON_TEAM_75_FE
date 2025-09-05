import TrashClothImg from "@assets/cloth.svg";
import TrashPackImg from "@assets/pack.svg";
import TrashFoodImg from "@assets/food.svg";
import TrashVinylImg from "@assets/vinyl.svg";

export interface TrashCardData {
  id: number;
  imageUrl: string;
  type: string;
  description: string;
  date: Date;
}

export const trashCardData: TrashCardData[] = [
  {
    id: 1,
    imageUrl: TrashClothImg,
    type: "의류·섬유류",
    description: "헌 옷 수거함",
    date: new Date("2025-01-01"),
  },
  {
    id: 2,
    imageUrl: TrashPackImg,
    type: "종이팩",
    description: "종이류와 별도 배출",
    date: new Date("2025-03-01"),
  },
  {
    id: 3,
    imageUrl: TrashFoodImg,
    type: "음식물 쓰레기",
    description: "플라스틱과 별도 배출",
    date: new Date("2025-05-01"),
  },
  {
    id: 4,
    imageUrl: TrashVinylImg,
    type: "비닐류",
    description: "작은 비닐도 비닐류",
    date: new Date("2024-07-01"),
  },
];

export const modalContentMap: {
  [key: string]: { title: string; content: string };
} = {
  "의류·섬유류": {
    title: "의류 및 섬유 제품 분리수거 의무화",
    content:
      " 2025년 1월부터 의류 및 섬유 제품을 일반 쓰레기통에 버리는 것이 금지됩니다. 모든 의류와 섬유 제품(헌 옷, 침구류, 커튼, 수건 등)은 헌 옷 수거함에 별도로 배출해야 합니다.\n\n의류 및 섬유 제품 분리수거 방법:\n1. 깨끗하게 세탁한 후 배출해 주세요\n2. 젖지 않도록 건조한 상태로 배출해 주세요\n3. 가능한 비닐봉투에 담아 헌 옷 수거함에 넣어주세요",
  },
  종이팩: {
    title: "종이팩 분리수거 방법 변경",
    content:
      " 2025년 3월부터는 종이팩을 일반 종이류와 함께 배출하는 것이 금지됩니다. 종이팩은 별도의 수거 장소에 배출해야 하며, 이 규정을 지키지 않을 경우 과태료가 부과될 수 있습니다.\n\n종이팩 분리수거 방법:\n1. 내용물을 비우고 물로 헹궈주세요\n2. 접어서 말린 후 별도 수거함에 배출해 주세요\n3. 종이류와 함께 배출하지 마세요",
  },
  "음식물 쓰레기": {
    title: "음식물 쓰레기 플라스틱 분리규정 강화",
    content:
      " 음식물 쓰레기통에 플라스틱이 포함되면 과태료가 부과될 수 있습니다.\n\n음식물 쓰레기 분리수거 주의사항:\n1. 음식물 쓰레기에 플라스틱, 비닐 등 이물질이 섞이지 않도록 철저히 분리해 주세요\n2. 음식물이 담겼던 용기의 경우, 내용물을 완전히 비우고 재활용 쓰레기로 분리해 주세요",
  },
  비닐류: {
    title: "폐비닐 분리배출 활성화",
    content:
      " 2024년 7월부터 작은 크기의 비닐이나 이물질이 묻은 비닐도 분리배출이 가능해졌습니다.\n\n폐비닐 분리수거 방법:\n1. 내용물을 비우고 가능한 이물질을 제거해 주세요\n2. 여러 장의 비닐을 모아서 배출하면 더욱 효율적입니다\n3. 투명 비닐봉투에 담아 '비닐류' 분리수거함에 배출해 주세요",
  },
};
