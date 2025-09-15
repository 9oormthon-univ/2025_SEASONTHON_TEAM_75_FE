import styled from "styled-components";
import Recycling from "@assets/badge_recycling.svg";
import Eco from "@assets/badge_eco.svg";
import Vinyl from "@assets/badge_vinyl.svg";
import Fire from "@assets/badge_fire.svg";
import Pack from "@assets/badge_pack.svg";
import Lock from "@assets/badge_lock.svg";

interface TagProps {
  type: "recycling" | "eco" | "vinyl" | "fire" | "pack" | "lock";
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
`;

const TagItem = ({ type }: TagProps) => {
  const mapping = {
    recycling: { icon: Recycling, title: "재활용 마스터" },
    eco: { icon: Eco, title: "친환경 전사" },
    vinyl: { icon: Vinyl, title: "비닐 사냥꾼" },
    fire: { icon: Fire, title: "연속 7일" },
    pack: { icon: Pack, title: "종이팩 사냥꾼" },
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
