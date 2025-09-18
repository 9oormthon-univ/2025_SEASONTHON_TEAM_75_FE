import Header from "@components/Header";
import * as P from "./ProfileSettingStyle";
import Profile from "@assets/profile.svg";
import AddIcon from "@assets/add.svg";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@utils/apiClient";
import MainButton from "@components/MainButton";
import { useAuthActions, useAuthStatus } from "@stores/authStore";
import type { UserResponse } from "@types";

const MAX_LEN = 20;

const ProfileSetting = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { checkAuth } = useAuthActions();
  const authStatus = useAuthStatus();

  useEffect(() => {
    if (authStatus !== "member") {
      checkAuth();
    }
  }, [authStatus, checkAuth]);

  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await apiClient.get<UserResponse>("/api/v1/users/me");
        const me = data.data;
        setNickname(me.nickName ?? "");
        setImgSrc(me.profileImageUrl || null);
      } catch (e) {
        console.error("프로필 조회 실패:", e);
      }
    };

    if (authStatus === "member") {
      fetchUserProfile();
    }
  }, [authStatus]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleComplete = async () => {
    if (!nickname.trim() || submitting) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify({ nickname })], { type: "application/json" })
      );
      if (file) form.append("image", file, file.name);

      await apiClient.patch("/api/v1/users", form);
      navigate("/profile/complete");
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 이미지 우선순위
  const displaySrc = previewUrl ?? imgSrc ?? Profile;

  return (
    <P.Page>
      <Header title="프로필 설정" isBackButton={true} />
      <P.Container>
        <P.Profile>
          <img src={displaySrc} alt="프로필" />
          <button type="button" onClick={handlePickImage}>
            <img src={AddIcon} alt="프로필 수정" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </P.Profile>

        <P.Nickname>
          <h3>닉네임</h3>
          <P.Input>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              maxLength={MAX_LEN}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={submitting}
            />
            <p>
              {nickname.length}/{MAX_LEN}
            </p>
          </P.Input>
          <p>2~20자의 한글, 영문, 숫자를 사용할 수 있어요</p>
        </P.Nickname>

        <P.Button>
          <MainButton
            disabled={submitting || nickname.trim().length === 0}
            onClick={handleComplete}
            title={submitting ? "저장 중..." : "완료"}
          />
        </P.Button>
      </P.Container>
    </P.Page>
  );
};

export default ProfileSetting;
