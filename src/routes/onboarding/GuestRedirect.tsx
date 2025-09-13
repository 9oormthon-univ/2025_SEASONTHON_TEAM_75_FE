import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDistrictActions } from "@stores/userDistrictStore";

const parseLabelToParts = (label?: string) => {
  const [sido, sigungu, eupmyeondong] = (label ?? "")
    .split(" ")
    .filter(Boolean);
  return {
    sido: sido ?? "",
    sigugn: sigungu ?? "",
    eupmyeondong: eupmyeondong ?? "",
  };
};

const GuestRedirect = () => {
  const navigate = useNavigate();
  const { setCurrentDistrict, setDistrict } = useDistrictActions();
  const started = useRef(false);

  const [msg, setMsg] = useState("현재 위치 확인 중...");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        setMsg("우리 동네 찾는 중...");
        const cur = await setCurrentDistrict();
        if (!cur) throw new Error("현재 위치로 자치구를 찾지 못했어요.");

        const label = [cur.sido, cur.sigugn, cur.eupmyeondong]
          .filter(Boolean)
          .join(" ");

        const parts = parseLabelToParts(label);

        setMsg("자치구 등록 중...");
        const registered = await setDistrict({
          districtId: cur.districtId,
          ...parts,
        });

        if (!registered) throw new Error("자치구 서버 등록 실패");

        navigate("/home", { replace: true });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [navigate, setCurrentDistrict, setDistrict]);

  return (
    <div style={{ padding: 24 }}>
      <h2>게스트 로그인 중…</h2>
      <p>{msg}</p>
    </div>
  );
};

export default GuestRedirect;
