import styled, { keyframes } from "styled-components";
import * as H from "@routes/history/HistoryStyle";
import * as C from "@components/history/HistoryCard";

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonBase = styled.div`
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  display: inline-block;
  position: relative;
  animation: ${shimmer} 1.5s linear infinite;
  border-radius: 4px;
`;

const HistoryCardSkeletonUI = () => (
  <C.Container style={{ cursor: "default" }}>
    <C.LeftSection>
      <SkeletonBase
        style={{ width: "63px", height: "63px", borderRadius: "8px" }}
      />
      <C.InfoWrapper>
        <SkeletonBase
          style={{ width: "70px", height: "22px", marginBottom: "6px" }}
        />
        <SkeletonBase style={{ width: "119px", height: "16px" }} />
      </C.InfoWrapper>
    </C.LeftSection>
  </C.Container>
);

export const HistoryPageSkeleton = () => (
  <>
    <H.SubHeader>
      <H.HistoryCount>
        <SkeletonBase style={{ width: "42px", height: "16px" }} />
      </H.HistoryCount>
    </H.SubHeader>
    <H.CardWrapper>
      <HistoryCardSkeletonUI />
      <HistoryCardSkeletonUI />
      <HistoryCardSkeletonUI />
    </H.CardWrapper>
  </>
);
