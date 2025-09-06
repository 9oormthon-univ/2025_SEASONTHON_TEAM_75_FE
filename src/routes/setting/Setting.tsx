import Header from "@components/Header";
import * as S from "./SettingStyle";
import ProfileImg from "@assets/profile.svg";
import ToggleListItem from "@components/setting/ToggleListItem";
import FeedbackIcon from "@assets/setting_feedback.svg";
import ArrowIcon from "@assets/history_arrow.svg";
import { useEffect, useState } from "react";
import LogoutModal from "@components/setting/LogoutModal";
import WithdrawModal from "@components/setting/WithdrawModal";
import apiClient from "@utils/apiClient";
import { useNavigate } from "react-router-dom";

// 타입
type User = {
  userId: number;
  nickName: string;
  profileImageUrl: string | null;
  createAt: string;
  updatedAt: string;
};

type UserResponse = {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: User;
};

type District = {
  response: {
    districtId: string;
    sido: string;
    sigugn: string;
    eupmyeondong: string;
  };
  userDistrictId: number;
  isDefault: boolean;
};

type DistrictResponse = {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: District[];
};

const Setting = () => {
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // 프로필
  const [me, setMe] = useState<User | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(ProfileImg);

  // 자치구
  const [defaultDistrict, setDefaultDistrict] = useState<string>("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await apiClient.get<UserResponse>("/api/v1/users/me");

        setMe(data.data);
        setImgSrc(data.data.profileImageUrl || ProfileImg);
      } catch (e) {
        console.error("프로필 조회 실패:", e);
      }
    };

    const fetchDistricts = async () => {
      try {
        const { data } = await apiClient.get<DistrictResponse>(
          "/api/v1/users/my/districts"
        );
        const def = data.data.find((d) => d.isDefault);
        if (def) {
          setDefaultDistrict(`${def.response.sido} ${def.response.sigugn}`);
        }
      } catch (e) {
        console.error("자치구 조회 실패:", e);
      }
    };

    fetchMe();
    fetchDistricts();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await apiClient.post("/api/v1/auth/kakao/logout");
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
      await apiClient.delete("/api/v1/users/me");
      alert("탈퇴 되었습니다.");
      navigate("/");
    } catch (e) {
      console.error("탈퇴 실패:", e);
      alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLogoutOpen(false);
    }
  };

  return (
    <S.Page>
      <Header title="설정" isBorder={true} />

      <S.Container>
        <S.Profile>
          <img
            src={imgSrc}
            alt="프로필 이미지"
            onError={() => setImgSrc(ProfileImg)}
          />
          <S.Info>
            <h3>{me?.nickName || "닉네임"}</h3>
            <p>{defaultDistrict || "기본 자치구"}</p>
          </S.Info>
        </S.Profile>

        <S.ToggleGroup>
          <ToggleListItem type="location" />
          <ToggleListItem type="mic" />
          <ToggleListItem type="saved" />
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
      </S.Container>

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
