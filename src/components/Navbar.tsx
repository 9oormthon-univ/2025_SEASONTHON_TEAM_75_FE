import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import NavHomeIcon from "@assets/nav_home.svg";
import NavChatIcon from "@assets/nav_chat.png";
import NavScanIcon from "@assets/nav_scan.svg";
import NavHistoryIcon from "@assets/nav_history.svg";
import NavMypageIcon from "@/assets/nav_mypage.svg";
import NavHomeIconAct from "@assets/nav_home_act.svg";
import NavHistoryIconAct from "@assets/nav_history_act.svg";
import NavMypageIconAct from "@/assets/nav_mypage_act.svg";

interface NavItemProps {
  $isActive: boolean;
}

const NavContainer = styled.nav`
  background-color: #ffffff;
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
  box-sizing: border-box;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, 0.07);
  pointer-events: auto;

  @media screen and (min-width: 1024px) {
    width: 393px;
    margin: 0 auto;
  }
`;

const NavItem = styled(NavLink)<NavItemProps>`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 1px;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.navAct : theme.colors.nav};
  font-size: 10px;
  font-weight: 500;
  flex: 1;
  padding-bottom: 20px;

  &:active,
  &:visited,
  &:hover {
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.navAct : theme.colors.nav};
  }
`;

const NavIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ScanButton = styled(NavLink)`
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
  const location = useLocation();
  const isHomeActive = location.pathname.startsWith("/home");
  const isHistoryActive = location.pathname.startsWith("/history");
  const isSettingActive = location.pathname.startsWith("/setting");
  return (
    <NavContainer>
      <NavItem to="/home" $isActive={isHomeActive}>
        <NavIcon src={isHomeActive ? NavHomeIconAct : NavHomeIcon} alt="홈" />
        <span>홈</span>
      </NavItem>
      <NavItem to="/chat" $isActive={false}>
        <NavIcon src={NavChatIcon} alt="챗봇" />
        <span>챗봇</span>
      </NavItem>
      <ScanButton to="/scan">
        <img src={NavScanIcon} alt="스캔" />
      </ScanButton>
      <NavItem to="/history" $isActive={isHistoryActive}>
        <NavIcon
          src={isHistoryActive ? NavHistoryIconAct : NavHistoryIcon}
          alt="최근기록"
        />
        <span>최근기록</span>
      </NavItem>
      <NavItem to="/setting" $isActive={isSettingActive}>
        <NavIcon
          src={isSettingActive ? NavMypageIconAct : NavMypageIcon}
          alt="마이페이지"
        />
        <span>마이페이지</span>
      </NavItem>
    </NavContainer>
  );
}

export default Navbar;
