import Header from "@components/Header";
import * as S from "./SettingStyle";
import ToggleListItem from "@components/setting/ToggleListItem";
import FeedbackIcon from "@assets/setting_feedback.svg";
import ArrowIcon from "@assets/history_arrow.svg";
import ProfileImg from "@assets/profile.svg";
import { useState } from "react";
import LogoutModal from "@components/setting/LogoutModal";
import WithdrawModal from "@components/setting/WithdrawModal";
import { useNavigate } from "react-router-dom";
import { useAuthActions, useAuthStatus, useMe } from "@stores/authStore";
import { useDefaultDistrict } from "@stores/userDistrictStore";
import TagItem from "@components/setting/TagItem";

const Setting = () => {
  const navigate = useNavigate();
  const { logout, withdraw } = useAuthActions();

  const authMe = useMe();
  const authStatus = useAuthStatus();
  const isMember = authStatus === "member";

  const defaultDistrict = useDefaultDistrict();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (e) {
      console.error("로그아웃 실패:", e);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLogoutOpen(false);
    }
  };

  // 탈퇴
  const handleWithdraw = async () => {
    try {
      await withdraw();
      alert("탈퇴 되었습니다.");
      navigate("/");
    } catch (e) {
      console.error("탈퇴 실패:", e);
      alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsWithdrawOpen(false);
    }
  };

  return (
    <S.Page>
      <Header title="마이페이지" isBorder={true} />

      <S.Container>
        <S.Profile onClick={() => !isMember && navigate("/login")}>
          <S.ProfileInfo>
            {authMe?.profileImageUrl ? (
              <S.ProfileImg src={authMe.profileImageUrl} alt="프로필 이미지" />
            ) : (
              <S.ProfileImg src={ProfileImg} alt="기본 프로필" />
            )}
            <S.Info>
              <h3>{isMember ? authMe?.nickName || "" : "로그인하세요"}</h3>
              <p>
                {isMember
                  ? [
                      defaultDistrict?.sido,
                      defaultDistrict?.sigugn,
                      defaultDistrict?.eupmyeondong,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : "분리특공대만의 기능을 만나보세요!"}
              </p>
            </S.Info>
          </S.ProfileInfo>
          {!isMember && <img src={ArrowIcon} alt="이동" />}
        </S.Profile>

        {isMember ? (
          <>
            <S.TagContainer>
              <h1>재활용 태그</h1>
              <S.TagItemGroup>
                <TagItem type="recycling" />
                <TagItem type="eco" />
                <TagItem type="vinyl" />
                <TagItem type="fire" />
                <TagItem type="pack" />
                <TagItem type="lock" />
              </S.TagItemGroup>
            </S.TagContainer>

            <S.ToggleGroup>
              <ToggleListItem type="alert" />
            </S.ToggleGroup>

            <S.Feedback onClick={() => navigate("/setting/feedback")}>
              <S.Left>
                <img src={FeedbackIcon} alt="피드백하기" />
                <p>피드백하기</p>
              </S.Left>
              <img src={ArrowIcon} alt="이동" />
            </S.Feedback>

            <S.Auth>
              <S.AuthItem onClick={() => setIsLogoutOpen(true)}>
                로그아웃
              </S.AuthItem>
              <S.AuthItem onClick={() => setIsWithdrawOpen(true)}>
                회원탈퇴
              </S.AuthItem>
            </S.Auth>
          </>
        ) : (
          <>
            <S.Feedback onClick={() => navigate("/setting/feedback")}>
              <S.Left>
                <img src={FeedbackIcon} alt="피드백하기" />
                <p>피드백하기</p>
              </S.Left>
              <img src={ArrowIcon} alt="이동" />
            </S.Feedback>
          </>
        )}
      </S.Container>

      {isMember && isLogoutOpen && (
        <LogoutModal
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogout}
        />
      )}

      {isMember && isWithdrawOpen && (
        <WithdrawModal
          onClose={() => setIsWithdrawOpen(false)}
          onConfirm={handleWithdraw}
        />
      )}
    </S.Page>
  );
};
export default Setting;
