import * as H from "@routes/history/HistoryEditStyle";
import Header from "@components/Header";
import GrayCheckIcon from "@assets/history_checkG.svg";
import WhiteCheckIcon from "@assets/history_checkW.svg";
import HistoryCard from "@components/history/HistoryCard";
import DeleteModal from "@components/history/DeleteModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: number;
  type: string;
  name: string;
}

const HistoryEdit = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 1, type: "비닐류", name: "비닐 라벨" },
    { id: 2, type: "PET(투명페트병)", name: "페트병 뚜껑" },
    { id: 3, type: "의류·섬유류", name: "반팔" },
  ]);

  const historyCount = historyItems.length;

  const isAllSelected = historyCount > 0 && selectedIds.length === historyCount;

  const handleCardClick = (id: number) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(historyItems.map((item) => item.id));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedIds.length === 0) return;
    console.log("삭제될 아이템 ID:", selectedIds);
    setHistoryItems((prevItems) =>
      prevItems.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]);
    setIsModalOpen(false);
    navigate("/history");
  };

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
