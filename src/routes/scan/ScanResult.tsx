import * as R from "@routes/scan/ScanResultStyle";
import BackIcon from "@/assets/back.svg";
import ExamImg from "@assets/examImg.svg";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import BottomSheet from "@components/scan/BottomSheet";
import PartCard from "@components/scan/PartCard";
import NoticeIcon from "@/assets/notice.svg";
import TypeModal from "@components/scan/TypeModal";

const ScanResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.capturedImage || ExamImg;
  const [open, setOpen] = useState(true);
  const snapPoints = [0.5, 0.9];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSelectType = (type: string) => {
    console.log("선택된 타입:", type);
    handleCloseModal();
  };

  const handleNavigateToScan = () => {
    navigate("/scan");
  };

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  interface PartCardData {
    id: number;
    name: string;
    type: string;
  }

  const partCardData = [
    {
      id: 1,
      name: "페트병 뚜껑",
      type: "PET(투명페트병)",
    },
    {
      id: 2,
      name: "투명 페트병 몸체",
      type: "PET(투명페트병)",
    },
    {
      id: 3,
      name: "비닐 라벨",
      type: "비닐류",
    },
  ];

  return (
    <R.Container>
      {isModalOpen && (
        <TypeModal onClose={handleCloseModal} onSelect={handleSelectType} />
      )}
      <R.Header>
        <R.BackBtn onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="뒤로 가기" />
        </R.BackBtn>
        <R.RightBtn onClick={handleOpenModal}>이 품목이 아닌가요?</R.RightBtn>
      </R.Header>
      <R.ScanImg src={imageSrc} alt="스캔 이미지" />
      <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
        <R.TopContainer>
          <R.TrashName>투명 페트병</R.TrashName>
          <R.TrashDes>재활용 쓰레기 : PET(투명페트병)</R.TrashDes>
          <R.AIBox>
            <R.AITitle>AI 요약</R.AITitle>
            <R.AIContent>
              투명 페트병 안에 음료가 조금 남아 있고, 뚜껑과 비닐 커버가 붙어
              있습니다.
            </R.AIContent>
          </R.AIBox>
        </R.TopContainer>
        <R.MidContainer>
          <R.LocationBox>
            강남구는 <span>월,화,수,목,금,토,일요일</span>에 버려요.
          </R.LocationBox>
          <R.MidSection>
            <R.Title>부품 카드</R.Title>
            {partCardData.map((card) => (
              <PartCard key={card.id} name={card.name} type={card.type} />
            ))}
          </R.MidSection>
          <R.MidSection>
            <R.Title>분리배출 가이드</R.Title>
            <R.GuideBox>
              <R.StepTitle>STEP 1</R.StepTitle>
              <R.StepContent>
                내용물을 비우고, 물로 내부를 깨끗이 세척하세요.
              </R.StepContent>
              <R.StepTitle>STEP 2</R.StepTitle>
              <R.StepContent>
                페트병 겉면에 붙어있는 비닐 라벨은 떼어내서 비닐류로
                분리배출하세요.
              </R.StepContent>
              <R.StepTitle>STEP 3</R.StepTitle>
              <R.StepContent>
                페트병은 최대한 압축해서 뚜껑을 닫은 후 PET로 한번에
                분리배출하세요.
              </R.StepContent>
              <R.Notice>
                <R.NoticeIcon src={NoticeIcon} alt="주의" />
                일반 플라스틱류와 분리하여 배출하세요!
              </R.Notice>
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
