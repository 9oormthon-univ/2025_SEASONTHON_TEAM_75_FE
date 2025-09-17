import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as H from "@routes/history/HistoryStyle";
import Header from "@components/Header";
import NoHistoryIcon from "@assets/history_zero.svg";
import HistoryCard from "@components/history/HistoryCard";
import apiClient from "@utils/apiClient";
import { useHistoryStore } from "@stores/historyStore";
import { HistoryPageSkeleton } from "@components/history/Skeleton";
import type { ApiTrashDetail } from "@types";
import { useAuthStatus } from "@stores/authStore";

const History = () => {
  const navigate = useNavigate();
  const { historyItems, setHistoryItems } = useHistoryStore();
  const [isLoading, setIsLoading] = useState(true);
  const authStatus = useAuthStatus();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await apiClient.get<{ data: ApiTrashDetail[] }>(
          "/api/v1/trash/my"
        );
        setHistoryItems(response.data.data);
      } catch (err) {
        console.error("최근 기록을 불러오는 데 실패했습니다:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authStatus === "member") {
      fetchHistoryData();
    } else if (authStatus === "guest") {
      setIsLoading(false);
      setHistoryItems([]);
    }
  }, [authStatus, setHistoryItems]);

  const historyCount = historyItems.length;

  const handleEditClick = () => {
    if (historyCount > 0) {
      navigate("/history/edit");
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/scan/result/${id}`);
  };

  const handleLoginPage = () => {
    navigate("/login");
  };

  if (authStatus === "loading" || isLoading) {
    return (
      <H.Container>
        <Header title={"최근기록"} isBorder={true} />
        <HistoryPageSkeleton />
      </H.Container>
    );
  }

  if (authStatus === "guest") {
    return (
      <H.Container>
        <Header title={"최근기록"} isBorder={true} />
        <H.NoLoginBox>
          <img src={NoHistoryIcon} alt="로그인 필요" />
          로그인하면
          <br />
          최근 기록을 확인할 수 있어요
          <H.LoginBtn onClick={handleLoginPage}>카카오로 로그인하기</H.LoginBtn>
        </H.NoLoginBox>
      </H.Container>
    );
  }

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
              <img src={NoHistoryIcon} alt="기록 없음" />
              아직 저장된 기록이 없어요
            </H.NoHistoryBox>
          ) : (
            <H.CardWrapper>
              {historyItems.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
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
