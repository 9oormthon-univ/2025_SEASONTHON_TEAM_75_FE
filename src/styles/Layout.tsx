import styled from "styled-components";
import Navbar from "@components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

const Container = styled.div<{ $hasNavbar: boolean }>`
  width: 100vw;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (min-width: 1025px) {
    width: 393px;
    margin: 0 auto;
  }
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
`;

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <Container $hasNavbar={showNavbar}>
      <Content>{children}</Content>
      {showNavbar && <Navbar />}
    </Container>
  );
}
