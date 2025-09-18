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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SkeletonText = styled(SkeletonBase)<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-bottom: 8px;
`;
const SkeletonIconBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const SkeletonIcon = styled(SkeletonBase)`
  width: 150px;
  height: 150px;
`;

export const MainSectionSkeleton = () => (
  <MainSkeletonWrapper>
    <SkeletonText width="72px" height="24px" />
    <SkeletonText width="100px" height="35px" />
    <SkeletonText
      width="180px"
      height="32px"
      style={{ marginBottom: "10px" }}
    />
    <SkeletonText width="220px" height="20px" />
    <SkeletonIconBox>
      <SkeletonIcon />
    </SkeletonIconBox>
  </MainSkeletonWrapper>
);

const SkeletonRankItem = styled.div`
  width: 221px;
  display: flex;
  position: relative;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
  flex-shrink: 0;
  background-color: #ffffff;
  overflow: hidden;
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 134px;
  object-fit: cover;
  align-self: center;
`;

const SkeletonInfo = styled.div`
  padding: 4% 6%;
  display: flex;
  flex-direction: column;
`;

export const RankingItemSkeleton = () => (
  <SkeletonRankItem>
    <SkeletonImage />
    <SkeletonInfo>
      <SkeletonText width="50px" height="27px" />
      <SkeletonText width="90px" height="13px" style={{ marginTop: "4px" }} />
    </SkeletonInfo>
  </SkeletonRankItem>
);

const CardSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 11px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.07);
`;
const CardSkeletonImage = styled(SkeletonBase)`
  width: 63px;
  height: 63px;
  border-radius: 8px;
`;

export const CardSkeletonInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
`;

export const TrashCardSkeleton = () => (
  <CardSkeletonWrapper>
    <CardSkeletonImage />
    <CardSkeletonInfoWrapper>
      <SkeletonText width="80px" height="27px" />
      <SkeletonText width="100px" height="21px" />
    </CardSkeletonInfoWrapper>
  </CardSkeletonWrapper>
);
