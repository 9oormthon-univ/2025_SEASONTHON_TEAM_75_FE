import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./PartnerLoginStyle";
import MainButton from "@components/MainButton";
import { useAuthActions } from "@stores/authStore";

const PartnerLogin = () => {
	const navigate = useNavigate();
	const { loginAsPartner } = useAuthActions();

	const [id, setId] = useState("");
	const [pw, setPw] = useState("");
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);

	const handleLogin = async () => {
		try {
			await loginAsPartner(id, pw);
			navigate("/partner/home");
		} catch {
			alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
		}
	};

	return (
		<L.Container>
			<div>
				<label htmlFor="partner-id">아이디</label>
				<input
					id="partner-id"
					type="text"
					value={id}
					onChange={(e) => setId(e.target.value)}
					autoComplete="username"
				/>
			</div>

			<div>
				<label htmlFor="partner-pw">비밀번호</label>
				<input
					id="partner-pw"
					type="password"
					value={pw}
					onChange={(e) => setPw(e.target.value)}
					autoComplete="current-password"
				/>
			</div>

			<label>
				<input
					type="checkbox"
					checked={keepLoggedIn}
					onChange={(e) => setKeepLoggedIn(e.target.checked)}
				/>
				로그인 상태 유지
			</label>

			<MainButton
				title="로그인"
				onClick={handleLogin}
				disabled={!id || !pw}
			/>
		</L.Container>
	);
};

export default PartnerLogin;
