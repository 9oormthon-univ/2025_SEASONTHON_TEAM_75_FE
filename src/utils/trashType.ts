import PaperIcon from "@assets/paper.svg";
import PackIcon from "@assets/pack.svg";
import PlasticIcon from "@assets/plastic.svg";
import PetIcon from "@assets/pet.svg";
import VinylIcon from "@assets/vinyl.svg";
import StyrofoamIcon from "@assets/styrofoam.svg";
import GlassIcon from "@assets/glass.svg";
import CanIcon from "@assets/can.svg";
import ClothIcon from "@assets/cloth.svg";
import HomeAppliancesIcon from "@assets/homeappliances.svg";
import EtcIcon from "@assets/etc.svg";
import TrashIcon from "@assets/trash.svg";
import FoodIcon from "@assets/food.svg";

export const TRASH_TYPES: { [key: string]: TrashTypeInfo } = {
  R01: { nameEn: "Paper", nameKo: "종이류", icon: PaperIcon },
  R02: { nameEn: "Paper pack", nameKo: "종이팩", icon: PackIcon },
  R03: { nameEn: "Plastic", nameKo: "플라스틱류", icon: PlasticIcon },
  R04: { nameEn: "PET", nameKo: "PET(투명 페트병)", icon: PetIcon },
  R05: { nameEn: "Vinyl/Film", nameKo: "비닐류", icon: VinylIcon },
  R06: { nameEn: "Styrofoam (EPS)", nameKo: "스티로폼류", icon: StyrofoamIcon },
  R07: { nameEn: "Glass", nameKo: "유리병류", icon: GlassIcon },
  R08: { nameEn: "Metal", nameKo: "캔류·고철류", icon: CanIcon },
  R09: { nameEn: "Textiles", nameKo: "의류·섬유류", icon: ClothIcon },
  R10: { nameEn: "E-Waste", nameKo: "폐가전류", icon: HomeAppliancesIcon },
  R11: {
    nameEn: "Hazardous Small Waste",
    nameKo: "소형 유해 폐기물",
    icon: EtcIcon,
  },
  N01: {
    nameEn: "Non-Recyclable Waste",
    nameKo: "일반 쓰레기",
    icon: TrashIcon,
  },
  F01: { nameEn: "Food Waste", nameKo: "음식물 쓰레기", icon: FoodIcon },
  UNK: { nameEn: "Unknown", nameKo: "미분류", icon: EtcIcon },
};

export interface TrashTypeInfo {
  nameEn: string;
  nameKo: string;
  icon: string;
}

export const getTrashType = (typeCode: string): TrashTypeInfo => {
  return TRASH_TYPES[typeCode] || TRASH_TYPES.UNK;
};
