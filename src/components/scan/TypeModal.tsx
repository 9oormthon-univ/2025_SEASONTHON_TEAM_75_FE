import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@utils/apiClient";
import type { SimilarTrashItem, ApiTrashDetail } from "@types";

interface TypeModalProps {
  trashId: number;
  onClose: () => void;
  onSelect: (newTrashData: ApiTrashDetail) => void;
}

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 30px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);
  width: 85%;
  gap: 25px;
  pointer-events: auto;
`;

export const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text1};
  text-align: center;
`;

export const TypeList = styled.div`
  font-family: "Pretendard";
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text2};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px 5px;
`;

export const Type = styled.div<{ isSelected: boolean }>`
  border-radius: 20px;
  width: fit-content;
  padding: 2px 10px;
  box-sizing: border-box;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.sub1 : "#ffffff"};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.main : theme.colors.text2};
  border: 1px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.colors.main : theme.colors.text4};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 500)};
`;

export const NoType = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text3};
  margin-left: 5px;

  span {
    color: ${({ theme }) => theme.colors.text2};
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;

export const SelectButton = styled.button`
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.main};
  color: #ffffff;
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.button`
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.text5};
  color: ${({ theme }) => theme.colors.text2};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TypeModal: React.FC<TypeModalProps> = ({
  trashId,
  onClose,
  onSelect,
}) => {
  const [items, setItems] = useState<SimilarTrashItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarItems = async () => {
      try {
        const response = await apiClient.get<{ data: SimilarTrashItem[] }>(
          `/api/v1/trash/${trashId}/items`
        );
        setItems(response.data.data);
      } catch (error) {
        console.error("비슷한 품목을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchSimilarItems();
  }, [trashId]);

  const handleSelect = async () => {
    if (selectedItemId === null) {
      alert("품목을 선택해주세요.");
      return;
    }

    try {
      const response = await apiClient.patch<{ data: ApiTrashDetail }>(
        `/api/v1/trash/${trashId}/items/${selectedItemId}`
      );
      onSelect(response.data.data);
    } catch (error) {
      console.error("품목 변경에 실패했습니다:", error);
      alert("품목 변경에 실패했습니다.");
    }
  };

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>비슷한 품목을 선택해주세요</Title>
        <TypeList>
          {items.map((item) => (
            <Type
              key={item.trashItemId}
              isSelected={selectedItemId === item.trashItemId}
              onClick={() => setSelectedItemId(item.trashItemId)}
            >
              {item.itemName}
            </Type>
          ))}
        </TypeList>
        <NoType>
          비슷한 품목이 없으신가요?{" "}
          <span onClick={handleNavigateToChat}>챗봇에게 물어보기</span>
        </NoType>
        <BtnWrapper>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <SelectButton onClick={handleSelect}>선택</SelectButton>
        </BtnWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TypeModal;
