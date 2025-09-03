import * as H from "@routes/history/HistoryStyle";
import Header from "@components/Header";
import NoHistoryIcon from "@assets/history_zero.svg";
import { useNavigate } from "react-router-dom";
import HistoryCard from "@components/history/HistoryCard";

interface HistoryItem {
  id: number;
  type: string;
  name: string;
}

const History = () => {
  const navigate = useNavigate();

  const historyItems: HistoryItem[] = [
    { id: 1, type: "비닐류", name: "비닐 라벨" },
    { id: 2, type: "PET(투명페트병)", name: "페트병 뚜껑" },
    { id: 3, type: "의류·섬유류", name: "반팔" },
  ];

  const historyCount = historyItems.length;

  const handleEditClick = () => {
    if (historyCount > 0) {
      navigate("/history/edit");
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/scan/result/${id}`);
  };

  return (
    <H.Container>
      <Header title={"최근기록"} onBack={() => console.log("뒤로가기")} />
      <H.SubHeader>
        <H.HistoryCount>총 {historyCount}개</H.HistoryCount>
        <H.EditBtn onClick={handleEditClick} disabled={historyCount === 0}>
          편집
        </H.EditBtn>
      </H.SubHeader>
      {historyCount === 0 ? (
        <H.NoHistoryBox>
          <img src={NoHistoryIcon} alt="기록 없음"></img>아직 저장된 기록이
          없어요
        </H.NoHistoryBox>
      ) : (
        <H.CardWrapper>
          {historyItems.map((item) => (
            <HistoryCard
              key={item.id}
              id={item.id}
              name={item.name}
              type={item.type}
              mode="view"
              onClick={handleCardClick}
            />
          ))}
        </H.CardWrapper>
      )}
    </H.Container>
  );
};
export default History;
