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

  @media screen and (min-width: 1025px) {
    width: 393px;
    margin: 0 auto;
  }
`;

interface CustomBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: (number | string)[];
}

const BottomSheet: React.FC<CustomBottomSheetProps> = ({
  open,
  onOpenChange,
  children,
  snapPoints = [0.4, 0.8],
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
            position: "fixed",
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
          }}
        >
          <ScrollableContainer>
            <div
              style={{
                margin: "1.3rem auto 0 auto",
                width: "36px",
                height: "4px",
                flexShrink: 0,
                borderRadius: "9999px",
                backgroundColor: "#D8D9DB",
              }}
            />
            <div style={{ width: "100%", margin: "0 auto 170px auto" }}>
              {children}
            </div>
          </ScrollableContainer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BottomSheet;
