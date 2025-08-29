import styled from "styled-components";
import { Link } from "react-router-dom";
import NavHomeIcon from "@assets/nav_home.svg";
import NavChatIcon from "@assets/nav_chat.svg";
import NavScanIcon from "@assets/nav_scan.svg";
import NavHistoryIcon from "@assets/nav_history.svg";
import NavSettingIcon from "@/assets/nav_setting.svg";

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  height: 78px;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #ffffff;
  box-sizing: border-box;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, 0.07);

  /* PC 환경에서 중앙 고정 */
  @media (hover: hover) and (pointer: fine) {
    width: 393px;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 4px;
  color: ${({ theme }) => theme.colors.text3};
  font-size: 10px;
  font-weight: 500;
  flex: 1;
`;

const NavIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ScanButton = styled(Link)`
  width: 68px;
  height: 68px;
  border-radius: 46.9px;
  background-color: ${({ theme }) => theme.colors.main};
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-20px);
  box-shadow: 0 0 11.72px 0 rgba(127, 220, 210, 0.8);

  img {
    width: 42.21px;
    height: 42.21px;
  }
`;

function Navbar() {
  return (
    <NavContainer>
      <NavItem to="/home">
        <NavIcon src={NavHomeIcon} alt="홈" />
        <span>홈</span>
      </NavItem>
      <NavItem to="/chat">
        <NavIcon src={NavChatIcon} alt="챗봇" />
        <span>챗봇</span>
      </NavItem>
      <ScanButton to="/scan">
        <img src={NavScanIcon} alt="스캔" />
      </ScanButton>
      <NavItem to="/history">
        <NavIcon src={NavHistoryIcon} alt="최근기록" />
        <span>최근기록</span>
      </NavItem>
      <NavItem to="/setting">
        <NavIcon src={NavSettingIcon} alt="설정" />
        <span>설정</span>
      </NavItem>
    </NavContainer>
  );
}

export default Navbar;
