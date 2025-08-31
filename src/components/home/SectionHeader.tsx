import React from "react";
import styled from "styled-components";

const SectionHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 1.5rem 1rem 1.5rem;
  box-sizing: border-box;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text1};
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 20px;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text3};
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 12px;
`;

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <SectionHeaderContainer>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </SectionHeaderContainer>
  );
};

export default SectionHeader;
