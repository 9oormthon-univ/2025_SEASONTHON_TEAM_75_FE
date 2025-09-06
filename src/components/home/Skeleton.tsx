import styled, { keyframes } from "styled-components";
import * as H from "@routes/home/HomeStyle";

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

const MainSkeletonWrapper = styled(H.MainSection)`
  align-items: flex-start;
`;
const SkeletonText = styled(SkeletonBase)<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-bottom: 8px;
`;
const SkeletonIcon = styled(SkeletonBase)`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export const MainSectionSkeleton = () => (
  <MainSkeletonWrapper>
    <SkeletonText width="50px" height="20px" />
    <SkeletonText width="200px" height="32px" />
    <SkeletonText
      width="150px"
      height="32px"
      style={{ marginBottom: "16px" }}
    />
    <SkeletonText width="220px" height="20px" />
    <SkeletonIcon />
  </MainSkeletonWrapper>
);

const RankingSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px;
`;
const SkeletonRank = styled(SkeletonBase)`
  width: 20px;
  height: 20px;
`;
const SkeletonImage = styled(SkeletonBase)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;
const SkeletonInfo = styled.div`
  flex: 1;
`;

export const RankingItemSkeleton = () => (
  <RankingSkeletonWrapper>
    <SkeletonRank />
    <SkeletonImage />
    <SkeletonInfo>
      <SkeletonText width="80%" height="20px" />
      <SkeletonText width="50%" height="16px" style={{ marginTop: "4px" }} />
    </SkeletonInfo>
  </RankingSkeletonWrapper>
);

const CardSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
`;
const CardSkeletonImage = styled(SkeletonBase)`
  width: 63px;
  height: 63px;
  border-radius: 8px;
`;

export const TrashCardSkeleton = () => (
  <CardSkeletonWrapper>
    <CardSkeletonImage />
    <SkeletonInfo>
      <SkeletonText width="40%" height="24px" />
      <SkeletonText width="70%" height="20px" style={{ marginTop: "6px" }} />
    </SkeletonInfo>
  </CardSkeletonWrapper>
);
