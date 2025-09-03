import Header from "@components/Header";
import * as P from "./ProfileSettingStyle";
import Profile from "@assets/profile.svg";
import AddIcon from "@assets/add.svg";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const MAX_LEN = 20;

const ProfileSetting = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleComplete = () => {
    if (nickname.trim().length === 0) return;
    navigate("/profile/complete");
  };

  return (
    <P.Page>
      <Header title="프로필 설정" />
      <P.Container>
        <P.Profile>
          <img src={Profile} alt="프로필" />
          <button>
            <img src={AddIcon} alt="프로필 수정" />
          </button>
        </P.Profile>

        <P.Nickname>
          <h3>닉네임</h3>
          <P.Input>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              maxLength={MAX_LEN}
              value={nickname}
              onChange={handleChange}
            />
            <p>
              {nickname.length}/{MAX_LEN}
            </p>
          </P.Input>
          <p>2~20자의 한글, 영문, 숫자를 사용할 수 있어요</p>
        </P.Nickname>

        <P.Button
          disabled={nickname.trim().length === 0}
          onClick={handleComplete}
        >
          완료
        </P.Button>
      </P.Container>
    </P.Page>
  );
};
export default ProfileSetting;
