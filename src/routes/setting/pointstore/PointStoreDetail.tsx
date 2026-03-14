import { useNavigate } from "react-router-dom";
import * as D from "./PointStoreDetailStyle";
import Header from "@components/Header";
import MainButton from "@components/MainButton";

// TODO: useParams로 id 받아서 API 연동
const MOCK_DETAIL = {
  id: 1,
  imageUrl: "https://placehold.co/400x240",
  points: 1500,
  brandImageUrl: "https://placehold.co/60x60",
  brandName: "그린 공방",
  brandLocation: "서울 마포구 합정동",
  notice: "공방 체험 시 10%를 할인해드립니다.",
  brandDescription: "그린 공방은 업사이클링과 친환경 소재를 활용한 공방입니다.",
};

// TODO: 실제 유저 포인트로 교체
const MOCK_USER_POINTS = 1500;

const PointStoreDetail = () => {
  const navigate = useNavigate();
  const item = MOCK_DETAIL;
  const canPurchase = MOCK_USER_POINTS >= item.points;

  return (
    <D.Page>
      <Header title="포인트 상점" isBackButton={true} />
      <D.ImageWrapper>
        <D.Thumbnail src={item.imageUrl} alt={item.brandName} />
        <D.PointsBadge>{item.points.toLocaleString()}P</D.PointsBadge>
      </D.ImageWrapper>
      <D.BrandSection>
        <D.BrandRow>
          <D.BrandImage src={item.brandImageUrl} alt={item.brandName} />
          <D.BrandInfo>
            <D.BrandName>{item.brandName}</D.BrandName>
            <D.BrandLocation>{item.brandLocation}</D.BrandLocation>
          </D.BrandInfo>
        </D.BrandRow>
      </D.BrandSection>
      <D.BottomSection>
        <D.NoticeBox>
          <p>{item.notice}</p>
        </D.NoticeBox>
        <D.BrandInfoSection>
          <D.SectionTitle>브랜드 정보</D.SectionTitle>
          <D.BrandDescription>{item.brandDescription}</D.BrandDescription>
        </D.BrandInfoSection>
        <D.ButtonWrapper>
          <MainButton
            title={canPurchase ? "구매하기" : "포인트가 부족합니다"}
            disabled={!canPurchase}
            onClick={() => navigate(`/store/${item.id}/success`)}
          />
        </D.ButtonWrapper>
      </D.BottomSection>
    </D.Page>
  );
};

export default PointStoreDetail;
