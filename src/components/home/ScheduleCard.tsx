import * as H from "@routes/home/HomeStyle";
import type { ScheduleInfo } from "@types";
import { Fragment } from "react";
import DefaultIcon from "@assets/main_default.svg";
import EarthIcon from "@assets/main_earth.svg";
import FoodIcon from "@assets/main_food.svg";
import PetIcon from "@assets/main_pet.svg";
import CalIcon from "@assets/main_cal.svg";

interface ScheduleCardProps {
  scheduleInfo: ScheduleInfo | null;
}

const ScheduleCard = ({ scheduleInfo }: ScheduleCardProps) => {
  const formattedDate = scheduleInfo?.date
    ? scheduleInfo.date.substring(5).replace("-", ".")
    : "";

  const renderContent = () => {
    if (!scheduleInfo) {
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

    const { categories, location } = scheduleInfo;

    switch (categories.length) {
      case 0:
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

      case 3:
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

      default:
        let icon = DefaultIcon;
        if (categories.includes("일반/음식물쓰레기")) {
          icon = FoodIcon;
        } else if (categories.includes("투명페트병/비닐")) {
          icon = PetIcon;
        }

        return {
          icon,
          title: (
            <H.Titles>
              <H.TitleTop>
                오늘은 <H.Highlight1>{location}</H.Highlight1>
              </H.TitleTop>
              <H.TitleBottom>
                <H.Highlight2>
                  {categories.map((cat, index) => (
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
          ),
        };
    }
  };

  const { icon, title } = renderContent();

  return (
    <H.MainSection>
      <H.Today>{formattedDate}</H.Today>
      {title}
      <H.MainIcon>
        <img src={icon} alt="메인 아이콘" />
      </H.MainIcon>
    </H.MainSection>
  );
};

export default ScheduleCard;
