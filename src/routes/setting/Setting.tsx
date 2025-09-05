import Header from "@components/Header";
import * as S from "./SettingStyle";
import ProfileImg from "@assets/profile.svg";
import ToggleListItem from "@components/setting/ToggleListItem";
import FeedbackIcon from "@assets/setting_feedback.svg";
import ArrowIcon from "@assets/history_arrow.svg";
import { useState } from "react";
import LogoutModal from "@components/setting/LogoutModal";
import WithdrawModal from "@components/setting/WithdrawModal";

const Setting = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // 로그아웃
  const handleLogout = () => {
    console.log("로그아웃");
    setIsLogoutOpen(false);
  };

  // 탈퇴
  const handleWithdraw = () => {
    console.log("회원탈퇴");
    setIsWithdrawOpen(false);
  };

  return (
    <S.Page>
      <Header title="설정" />

      <S.Profile>
        <img src={ProfileImg} alt="프로필 이미지" />
        <S.Info>
          <h3>닉네임</h3>
          <p>디폴트 자치구</p>
        </S.Info>
      </S.Profile>

      <S.ToggleGroup>
        <ToggleListItem type="location" />
        <ToggleListItem type="mic" />
        <ToggleListItem type="saved" />
      </S.ToggleGroup>

      <S.Feedback>
        <S.Left>
          <img src={FeedbackIcon} alt="피드백하기" />
          <p>피드백하기</p>
        </S.Left>
        <img src={ArrowIcon} alt="이동" />
      </S.Feedback>

      <S.Auth>
        <S.AuthItem onClick={() => setIsLogoutOpen(true)}>로그아웃</S.AuthItem>
        <S.AuthItem onClick={() => setIsWithdrawOpen(true)}>
          회원탈퇴
        </S.AuthItem>
      </S.Auth>

      {isLogoutOpen && (
        <LogoutModal
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogout}
        />
      )}

      {isWithdrawOpen && (
        <WithdrawModal
          onClose={() => setIsWithdrawOpen(false)}
          onConfirm={handleWithdraw}
        />
      )}
    </S.Page>
  );
};
export default Setting;
