import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as H from "@routes/history/HistoryStyle";
import Header from "@components/Header";
import NoHistoryIcon from "@assets/history_zero.svg";
import HistoryCard from "@components/history/HistoryCard";
import apiClient from "@utils/apiClient";
import { useHistoryStore, type ApiHistoryItem } from "@stores/historyStore";
import { HistoryPageSkeleton } from "@components/history/Skeleton";

const History = () => {
  const navigate = useNavigate();
  const { historyItems, setHistoryItems } = useHistoryStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await apiClient.get<{ data: ApiHistoryItem[] }>(
          "/api/v1/trash/my"
        );
        setHistoryItems(response.data.data);
      } catch (err) {
        console.error("최근 기록을 불러오는 데 실패했습니다:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [setHistoryItems]);

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
      <Header title={"최근기록"} isBorder={true} />
      {isLoading ? (
        <HistoryPageSkeleton />
      ) : (
        <>
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
        </>
      )}
    </H.Container>
  );
};
export default History;
