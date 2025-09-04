import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DEFAULT_DEST = "/profile";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const dest = params.get("redirect") || DEFAULT_DEST;
    navigate(dest, { replace: true });
  }, [navigate, search]);

  return <p>로그인 처리 중</p>;
}
