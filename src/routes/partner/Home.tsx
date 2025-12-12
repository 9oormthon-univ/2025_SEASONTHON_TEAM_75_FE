import * as H from "@routes/partner/HomeStyle";
import SectionHeader from "@components/home/SectionHeader";
import AdBanner from "@components/home/AdBanner";
import LogoIcon from "@assets/home_logo.svg";
import QRIcon from "@assets/qr_icon.svg";
import Arrow from "@assets/pt_cs_arrow.svg";
import TodayUsage from "@components/partner/TodayUsage";
import CouponStats from "@components/partner/CouponStats";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const TodayUsageClick = () => {
    navigate("/partner/usage");
  };

  const handleQRClick = () => {
    navigate("/partner/scan");
  };

  return (
    <H.HomeContainer>
      <H.HomeHeader>
        <H.Logo src={LogoIcon} alt="로고" />
      </H.HomeHeader>
      <H.QRBox onClick={handleQRClick}>
        <H.QRIcon>
          <img src={QRIcon} alt="큐알" />
        </H.QRIcon>
        <H.Titles>
          <H.TitleTop>QR 코드 스캔</H.TitleTop>
          <H.TitleBottom>쿠폰을 스캔하여 사용 처리하세요</H.TitleBottom>
        </H.Titles>
      </H.QRBox>
      <H.BgBox>
        <SectionHeader title="오늘의 사용 현황" />
        <H.TodayUsageList>
          <TodayUsage
            title="사용된 쿠폰"
            usage="2개"
            onClick={TodayUsageClick}
          />
          <TodayUsage title="오늘 매출" usage="100,000원" />
        </H.TodayUsageList>
        <SectionHeader title="쿠폰 사용 통계" />
        <CouponStats />
        <H.Inquiry>
          <div>분리특공대에게 문의하기</div>
          <img src={Arrow} alt="화살표" />
        </H.Inquiry>
        <AdBanner />
      </H.BgBox>
    </H.HomeContainer>
  );
};
export default Home;
