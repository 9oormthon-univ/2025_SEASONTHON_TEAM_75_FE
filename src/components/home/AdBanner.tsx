import styled from "styled-components";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import AdFirstShort from "@assets/ad_short_1.png";
import AdSecondShort from "@assets/ad_short_2.png";
import AdFirstLong from "@assets/ad_long_1.png";
import AdSecondLong from "@assets/ad_long_2.png";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;

  .ad-banner-swiper {
    width: 100%;
    max-width: 688px;

    @media (max-width: 767.98px) {
      max-width: 361px;
    }

    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .swiper-pagination {
      width: fit-content;
      height: 16px;
      border-radius: 37px;
      padding: 0 8px;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.35);
      color: #ffffff;
      font-family: "Pretendard";
      font-weight: 400;
      font-size: 9px;
      left: auto;
      right: 15px;
      bottom: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2px;
    }
  }
`;

const Banner = styled.img`
  width: 100%;
  display: block;
`;

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};

const AdBanner = () => {
  const isTabletView = useMediaQuery(
    "(min-width: 768px) and (max-width: 1024.98px)"
  );

  const mobileBanners = [AdFirstShort, AdSecondShort];
  const tabletBanners = [AdFirstLong, AdSecondLong];
  const bannersToShow = isTabletView ? tabletBanners : mobileBanners;

  return (
    <Container>
      <Swiper
        modules={[Pagination]}
        pagination={{
          type: "fraction",
          renderFraction: function (currentClass, totalClass) {
            return `<span class="${currentClass}"></span><span>/</span><span class="${totalClass}"></span><span>+</span>`;
          },
        }}
        loop={true}
        key={isTabletView ? "tablet" : "mobile"}
        className="ad-banner-swiper"
      >
        {bannersToShow.map((bannerSrc, index) => (
          <SwiperSlide key={index}>
            <Banner src={bannerSrc} alt={`광고 배너 ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default AdBanner;
