import styled from "styled-components";
import Recycling from "@assets/badge_recycling.png";
import Eco from "@assets/badge_eco.png";
import Vinyl from "@assets/badge_vinyl.png";
import Fire from "@assets/badge_fire.png";
import Pack from "@assets/badge_pack.png";
import Lock from "@assets/badge_lock.png";

export interface TagProps {
  type:
    | "재활용 마스터"
    | "친환경 전사"
    | "비닐사냥꾼"
    | "연속 7일"
    | "종이팩사냥꾼"
    | "lock";
}

const mapping: Record<TagProps["type"], { icon: string; title: string }> = {
  "재활용 마스터": { icon: Recycling, title: "재활용 마스터" },
  "친환경 전사": { icon: Eco, title: "친환경 전사" },
  비닐사냥꾼: { icon: Vinyl, title: "비닐사냥꾼" },
  "연속 7일": { icon: Fire, title: "연속 7일" },
  종이팩사냥꾼: { icon: Pack, title: "종이팩사냥꾼" },
  lock: { icon: Lock, title: "잠금됨" },
};

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
    height: 66px;
  }
`;

const TagItem = ({ type }: TagProps) => {
  const meta = mapping[type] ?? mapping.lock;
  const isLocked = type === "lock";

  return (
    <Container $isLocked={isLocked}>
      <img src={meta.icon} alt={meta.title} />
      <p>{meta.title}</p>
    </Container>
  );
};

export default TagItem;
