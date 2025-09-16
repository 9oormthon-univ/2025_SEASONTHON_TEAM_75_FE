import * as R from "@routes/scan/ScanResultStyle";
import BackIcon from "@/assets/back.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import BottomSheet from "@components/scan/BottomSheet";
import PartCard from "@components/scan/PartCard";
import GuideSteps from "@components/scan/GuideSteps";
import NoticeIcon from "@/assets/notice.svg";
import { useScanResultStore } from "@stores/scanResultStore";
import type { SimilarTrashItem, ApiTrashDetail } from "@types";
import apiClient from "@utils/apiClient";
import { RemoveScroll } from "react-remove-scroll";

const ScanResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    currentResult,
    setResultFromNavigation,
    fetchResultById,
    clearCurrentResult,
    updateCurrentResult,
  } = useScanResultStore();
  const navigatedApiResult = location.state?.apiResult as
    | ApiTrashDetail
    | undefined;
  const capturedImage = location.state?.capturedImage;

  const [open, setOpen] = useState(true);
  const snapPoints = [0.5, 0.9];
  const [similarItems, setSimilarItems] = useState<SimilarTrashItem[]>([]);
  const [selectedSimilarItemId, setSelectedSimilarItemId] = useState<
    number | null
  >(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNavigateToScan = () => {
    navigate("/scan");
  };

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  useEffect(() => {
    const resultId = Number(id);
    if (!resultId) {
      navigate(-1);
      return;
    }

    if (navigatedApiResult) {
      setResultFromNavigation(navigatedApiResult);
    } else {
      fetchResultById(resultId);
    }

    return () => {
      clearCurrentResult();
    };
  }, [
    id,
    navigatedApiResult,
    fetchResultById,
    setResultFromNavigation,
    navigate,
    clearCurrentResult,
  ]);

  useEffect(() => {
    const fetchSimilarItems = async () => {
      if (currentResult) {
        setSelectedSimilarItemId(null);
        try {
          const response = await apiClient.get<{ data: SimilarTrashItem[] }>(
            `/api/v1/trash/${currentResult.id}/items`
          );
          setSimilarItems(response.data.data);
        } catch (error) {
          console.error("비슷한 품목을 불러오는 데 실패했습니다:", error);
        }
      }
    };

    fetchSimilarItems();
  }, [currentResult]);

  const handleItemSelect = async (selectedItemId: number) => {
    if (!currentResult) {
      return;
    }
    setSelectedSimilarItemId(selectedItemId);
    setIsUpdating(true);
    try {
      const response = await apiClient.patch<{ data: ApiTrashDetail }>(
        `/api/v1/trash/${currentResult.id}/items/${selectedItemId}`
      );
      updateCurrentResult(response.data.data);
      console.log(
        "선택된 타입으로 데이터 업데이트:",
        response.data.data.itemName
      );
    } catch (error) {
      console.error("품목 변경에 실패했습니다:", error);
      alert("품목 변경에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentResult) {
    return null;
  }

  const prefix = currentResult.typeCode.charAt(0);

  return (
    <R.Container>
      <R.Header>
        <R.BackBtn onClick={() => navigate("/home")}>
          <img src={BackIcon} alt="뒤로 가기" />
        </R.BackBtn>
      </R.Header>
      <R.ScanImg
        src={capturedImage || currentResult.imageUrl}
        alt="스캔 이미지"
      />
      <RemoveScroll enabled={open}>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          snapPoints={snapPoints}
          isLoading={isUpdating}
        >
          <R.TopContainer>
            <R.TrashName>{currentResult.name}</R.TrashName>
            <R.TrashDes>
              {prefix === "R"
                ? `재활용 쓰레기 : ${currentResult.typeName}`
                : currentResult.typeName}
            </R.TrashDes>
            <R.TypeChangeBox>
              <R.TypeChangeTitle>이 품목이 아닌가요?</R.TypeChangeTitle>
              <R.TypeChangeContent>
                {similarItems.map((item) => (
                  <R.Type
                    key={item.trashItemId}
                    isSelected={selectedSimilarItemId === item.trashItemId}
                    onClick={() => handleItemSelect(item.trashItemId)}
                  >
                    {item.itemName}
                  </R.Type>
                ))}
              </R.TypeChangeContent>
            </R.TypeChangeBox>
          </R.TopContainer>
          <R.MidContainer>
            {currentResult.parts && currentResult.parts.length > 0 && (
              <R.MidSection>
                <R.Title>부품 카드</R.Title>
                {currentResult.parts.map((part) => (
                  <PartCard
                    key={part.name}
                    name={part.name}
                    type={part.typeCode}
                  />
                ))}
              </R.MidSection>
            )}
            <R.MidSection>
              <R.Title>분리배출 가이드</R.Title>
              <R.GuideBox>
                <GuideSteps steps={currentResult.guideSteps} />
                {currentResult.cautionNote && (
                  <R.Notice>
                    <R.NoticeIcon src={NoticeIcon} alt="주의" />
                    {currentResult.cautionNote}
                  </R.Notice>
                )}
              </R.GuideBox>
            </R.MidSection>
            {currentResult.location &&
              currentResult.days &&
              currentResult.days.length > 0 && (
                <R.LocationBox>
                  {currentResult.location.sigungu}는{" "}
                  <span>
                    {currentResult.days
                      .map((day) => day.replace("요일", ""))
                      .join(",")}
                    요일
                  </span>
                  에 버려요.
                </R.LocationBox>
              )}
          </R.MidContainer>
          <R.ButtonWrapper>
            <R.ScanBtn onClick={handleNavigateToScan}>
              다른 쓰레기 분리수거하기
            </R.ScanBtn>
            <R.ChatBtn onClick={handleNavigateToChat}>
              챗봇에게 물어보기
            </R.ChatBtn>
          </R.ButtonWrapper>
        </BottomSheet>
      </RemoveScroll>
    </R.Container>
  );
};

export default ScanResult;
