import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 450px;
    width: 66.7%;
    aspect-ratio: 1 / 1;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);

    @media (max-width: 376px) {
      width: 220px;
    }
  }
`;

export const ScanBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  max-width: 450px;
  width: 66.7%;
  aspect-ratio: 1 / 1;

  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2H2V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 2H98V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 98H2V90" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 98H98V90" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  @media (max-width: 376px) {
    width: 220px;
  }
`;

export const Header = styled.div`
  width: 100%;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
`;

export const Title = styled.div`
  color: #ffffff;
  font-family: "Pretendard";
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-top: 80px;
`;

export const CloseButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  img {
    width: 21px;
    height: 21px;
  }
`;
