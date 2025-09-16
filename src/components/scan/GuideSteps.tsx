import styled from "styled-components";
import React from "react";

interface GuideStepsProps {
  steps: string[];
}

export const StepTitle = styled.div`
  color: ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.sub1};
  font-weight: 600;
  font-size: 14px;
  width: fit-content;
  padding: 1px 11px;
  box-sizing: border-box;
  border-radius: 20px;
`;

export const StepContent = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 500;
  font-size: 16px;
  margin: 10px 0 20px 5px;
`;

const GuideSteps: React.FC<GuideStepsProps> = ({ steps }) => {
  return (
    <>
      {steps.flatMap((step, index) => [
        <StepTitle key={`title-${index}`}>STEP {index + 1}</StepTitle>,
        <StepContent key={`content-${index}`}>{step}</StepContent>,
      ])}
    </>
  );
};

export default GuideSteps;
