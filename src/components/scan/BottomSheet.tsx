import React from "react";
import { Drawer } from "vaul";
import styled from "styled-components";

export const ScrollableContainer = styled.div`
  width: 100%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media screen and (min-width: 1024px) {
    width: 393px;
    margin: 0 auto;
  }
`;

const SheetSpinnerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid ${({ theme }) => theme.colors.text4 || "#e0e0e0"};
  border-top-color: ${({ theme }) => theme.colors.main || "#000000"};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const DragHandle = styled.div`
  margin: 1rem auto;
  width: 36px;
  height: 4px;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: #d8d9db;
`;

interface CustomBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: (number | string)[];
  isLoading?: boolean;
}

const BottomSheet: React.FC<CustomBottomSheetProps> = ({
  open,
  onOpenChange,
  children,
  snapPoints = [0.4, 0.8],
  isLoading = false,
}) => {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "90vh",
            width: "100%",
            position: "fixed",
          }}
        >
          <DragHandle />
          <ScrollableContainer>
            <div style={{ width: "100%", margin: "0 auto 170px auto" }}>
              {children}
            </div>
          </ScrollableContainer>

          {isLoading && (
            <SheetSpinnerOverlay>
              <Spinner />
            </SheetSpinnerOverlay>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BottomSheet;
