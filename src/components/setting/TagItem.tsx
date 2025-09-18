import styled from "styled-components";
import Recycling from "@assets/badge_recycling.svg";
import Eco from "@assets/badge_eco.svg";
import Vinyl from "@assets/badge_vinyl.svg";
import Fire from "@assets/badge_fire.svg";
import Pack from "@assets/badge_pack.svg";
import Lock from "@assets/badge_lock.svg";

export interface TagProps {
  type:
    | "재활용 마스터"
    | "친환경 전사"
    | "비닐사냥꾼"
    | "연속 7일"
    | "종이팩사냥꾼"
    | "lock";
}

const Container = styled.div<{ $isLocked: boolean }>`
  display: flex;
  padding: 14px 16px 12px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 11.6px;

  border-radius: 20px;
  border: 1.5px solid
    ${({ theme, $isLocked }) => ($isLocked ? theme.colors.text5 : "#B6EDE5")};
  background: white;

  p {
    margin: 0;
    color: #525252;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
  }

  img {
    width: 60px;
  }
`;

const TagItem = ({ type }: TagProps) => {
  const mapping = {
    "재활용 마스터": { icon: Recycling, title: type },
    "친환경 전사": { icon: Eco, title: type },
    비닐사냥꾼: { icon: Vinyl, title: type },
    "연속 7일": { icon: Fire, title: type },
    종이팩사냥꾼: { icon: Pack, title: type },
    lock: { icon: Lock, title: "잠금됨" },
  };

  const { icon, title } = mapping[type];
  const isLocked = type === "lock";

  return (
    <Container $isLocked={isLocked}>
      <img src={icon} alt={title} />
      <p>{title}</p>
    </Container>
  );
};

export default TagItem;
