import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

export const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 450px;
    width: 86%;
    aspect-ratio: 340 / 545;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);

    @media (max-width: 376px) {
      width: 250px;
    }
  }
`;

export const ScanBox = styled.div`
  position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  max-width: 450px;
  width: 86%;
  aspect-ratio: 340 / 545;

  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" viewBox="0 0 340 545" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 4H4V25" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M315 4H336V25" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 541H4V520" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M315 541H336V520" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  @media (max-width: 376px) {
    width: 250px;
  }
`;

export const Header = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export const Title = styled.div`
  color: #ffffff;
  font-family: "Pretendard";
  font-size: 20px;
  font-weight: bold;
`;

export const CloseButton = styled.img`
  position: absolute;
  right: 1.5rem;
  width: 21px;
  height: 21px;
  cursor: pointer;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  padding: 2rem 1.9rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;

  @media (max-width: 376px) {
    width: 300px;
  }
`;

export const ActionButton = styled.img`
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

export const CaptureButton = styled.img`
  cursor: pointer;
  width: 68px;
  height: 68px;
`;
