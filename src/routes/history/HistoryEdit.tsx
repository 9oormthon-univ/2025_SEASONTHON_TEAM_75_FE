import * as H from "@routes/history/HistoryEditStyle";
import Header from "@components/Header";
import GrayCheckIcon from "@assets/history_checkG.svg";
import WhiteCheckIcon from "@assets/history_checkW.svg";
import HistoryCard from "@components/history/HistoryCard";
import DeleteModal from "@components/history/DeleteModal";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "@stores/historyStore";
import apiClient from "@utils/apiClient";

const HistoryEdit = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { historyItems, deleteHistoryItems } = useHistoryStore();
  const historyCount = historyItems.length;
  const isAllSelected = historyCount > 0 && selectedIds.length === historyCount;

  const handleCardClick = useCallback((id: number) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((prevId) => prevId !== id)
        : [...prevIds, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(historyItems.map((item) => item.id));
    }
  }, [isAllSelected, historyItems]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;

    try {
      const deletePromises = selectedIds.map((id) =>
        apiClient.delete(`/api/v1/trash/${id}`)
      );
      await Promise.all(deletePromises);
      deleteHistoryItems(selectedIds);
      setSelectedIds([]);
      setIsModalOpen(false);
      navigate("/history");
    } catch (err) {
      console.error("삭제 요청 중 일부 또는 전체가 실패했습니다:", err);
      setIsModalOpen(false);
    }
  }, [selectedIds, deleteHistoryItems, navigate]);

  return (
    <H.Container>
      <Header title={"최근기록"} onBack={() => console.log("뒤로가기")} />
      <H.SubHeader>
        <H.HistoryCount>총 {historyCount}개</H.HistoryCount>
        <H.SelectAllBtn onClick={handleSelectAll} isActive={isAllSelected}>
          <img
            src={isAllSelected ? WhiteCheckIcon : GrayCheckIcon}
            alt="체크 아이콘"
          />
          모두선택
        </H.SelectAllBtn>
      </H.SubHeader>
      <H.CardWrapper>
        {historyItems.map((item) => (
          <HistoryCard
            key={item.id}
            id={item.id}
            name={item.name}
            type={item.type}
            mode="edit"
            isSelected={selectedIds.includes(item.id)}
            onClick={handleCardClick}
          />
        ))}
      </H.CardWrapper>
      <H.Bottom>
        <H.DeleteBtn
          onClick={() => setIsModalOpen(true)}
          disabled={selectedIds.length === 0}
        >
          삭제
        </H.DeleteBtn>
      </H.Bottom>
      {isModalOpen && (
        <DeleteModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </H.Container>
  );
};
export default HistoryEdit;
