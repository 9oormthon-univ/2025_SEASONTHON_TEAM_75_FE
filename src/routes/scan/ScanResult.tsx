import * as R from "@routes/scan/ScanResultStyle";
import BackIcon from "@/assets/back.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import BottomSheet from "@components/scan/BottomSheet";
import PartCard from "@components/scan/PartCard";
import NoticeIcon from "@/assets/notice.svg";
import TypeModal from "@components/scan/TypeModal";
import {
  useScanResultStore,
  type ApiScanResult,
} from "@stores/scanResultStore";

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
    | ApiScanResult
    | undefined;
  const capturedImage = location.state?.capturedImage;

  const [open, setOpen] = useState(true);
  const snapPoints = [0.5, 0.9];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSelectType = (newTrashData: ApiScanResult) => {
    console.log("선택된 타입으로 데이터 업데이트:", newTrashData.itemName);
    updateCurrentResult(newTrashData);
    handleCloseModal();
  };

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

  if (!currentResult) {
    return null;
  }

  const guideElements = currentResult.guideSteps.flatMap((step, index) => [
    <R.StepTitle key={`title-${index}`}>STEP {index + 1}</R.StepTitle>,
    <R.StepContent key={`content-${index}`}>{step}</R.StepContent>,
  ]);

  const prefix = currentResult.typeCode.charAt(0);

  return (
    <R.Container>
      {isModalOpen && (
        <TypeModal
          trashId={currentResult.id}
          onClose={handleCloseModal}
          onSelect={handleSelectType}
        />
      )}
      <R.Header>
        <R.BackBtn onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="뒤로 가기" />
        </R.BackBtn>
        <R.RightBtn onClick={handleOpenModal}>이 품목이 아닌가요?</R.RightBtn>
      </R.Header>
      <R.ScanImg
        src={capturedImage || currentResult.imageUrl}
        alt="스캔 이미지"
      />
      <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
        <R.TopContainer>
          <R.TrashName>
            {currentResult.itemName || currentResult.name}
          </R.TrashName>
          <R.TrashDes>
            {prefix === "R"
              ? `재활용 쓰레기 : ${currentResult.typeName}`
              : currentResult.typeName}
          </R.TrashDes>
          <R.AIBox>
            <R.AITitle>AI 요약</R.AITitle>
            <R.AIContent>{currentResult.summary}</R.AIContent>
          </R.AIBox>
        </R.TopContainer>
        <R.MidContainer>
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
              {guideElements}
              {currentResult.cautionNote && (
                <R.Notice>
                  <R.NoticeIcon src={NoticeIcon} alt="주의" />
                  {currentResult.cautionNote}
                </R.Notice>
              )}
            </R.GuideBox>
          </R.MidSection>
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
    </R.Container>
  );
};

export default ScanResult;
